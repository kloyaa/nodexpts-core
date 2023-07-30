import mongoose from 'mongoose'; // Import the mongoose library
import { Request, Response } from "express";
import { Bet } from "../models/bet.model";
import { RequestValidator } from "../../__core/utils/validation.util";
import { statuses as BetStatuses } from "../const/api-statuses.const";
import { IBet } from '../interface/bet.interface';
import { emitter } from '../events/activity.event';
import { IActivity } from '../../__core/interfaces/schema.interface';
import { BetActivityType, BetEventName } from '../enum/activity.enum';

const validTimeForSTL = ["10:30 AM", "3:00 PM", "8:00 PM"];
const validTimeFor3D = ["2:00 PM", "5:00 PM", "9:00 PM"];

export const placeBet = async (req: Request & { user?: any }, res: Response) => {
    try {
        // Check if there are any validation errors
        const error = new RequestValidator().createBetAPI(req.body)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        const { type, schedule, time, amount, rambled, number } = req.body;

        const isSoldOut = await isSoldOutNumber(number);
        if(isSoldOut) {
            return res.status(403).json(BetStatuses["0312"]);
        }

        if(rambled && (Number(amount) % 6) !== 0) {
            return res.status(403).json(BetStatuses["0311"]);
        }

        if(type === "STL" && !validTimeForSTL.includes(time)){
            return res.status(403).json({
                ...BetStatuses["0310"], data: `Time ${validTimeForSTL.join(", ")}`
            });
        }

        if(type === "3D" && !validTimeFor3D.includes(time)){
            return res.status(403).json({
                ...BetStatuses["0310"], data: `Time ${validTimeFor3D.join(", ")}`
            });
        }
        
        // Create the new bet
        const newBet = new Bet({
            user: req.user.value,
            type,
            schedule,
            time,
            amount,
            rambled,
            number
        });
    
        // Save the bet to the database
        const savedBet = await newBet.save();
    
        emitter.emit(BetEventName.PLACE_BET, {
            user: req.user.value,
            description: BetActivityType.PLACE_BET,
        } as IActivity);

        // Return the newly created bet as the response
        return res.status(201).json(savedBet);
        } catch (error) {
            console.log('@createBet error', error)
            res.status(500).json(error);
    }
};

export const getAll = async (req: Request & { user?: any }, res: Response) => {
    try {
        // Check if there are any validation errors
        const error = new RequestValidator().getAllBetsAPI(req.query)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        const { time, type, schedule, user } = req.query;

        const pipeline = [];
        if (time || type || schedule || user) {
            // Convert schedule to "YYYY-MM-DD" format for matching
            const formattedSchedule = schedule 
                ? new Date(schedule as unknown as Date).toISOString().substring(0, 10) 
                : new Date().toISOString().substring(0, 10);

            // If any of the query parameters is present, add the $match stage
            const matchStage: any = {};

            if (formattedSchedule) {
                matchStage.$expr = {
                    $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                        formattedSchedule,
                    ],
                };
            }

            if (type) {
                matchStage.type = type;
            }
            if (time) {
                matchStage.time = time;
            }
            if (user) {
                matchStage.user = new mongoose.Types.ObjectId(user as string);
            }
            pipeline.push({ $match: matchStage });
        }
        pipeline.push(
            {
                $lookup: {
                    from: 'profiles', // Assuming your User collection is named 'profiles'
                    localField: 'user',
                    foreignField: 'user',
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            {
                $project: {
                    type: 1,
                    schedule: {
                        $dateToString: {
                            date: '$schedule',
                            format: '%Y-%m-%d',
                            timezone: 'UTC',
                        },
                    },
                    time: 1,
                    amount: 1,
                    rambled: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1,
                    },
                },
            }
        );

        const result = await Bet.aggregate(pipeline);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log('@getAll error', error)
        res.status(500).json(error);
    }
}

const isSoldOutNumber = async (number: string): Promise<boolean> => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00.0000 UTC for today

        const pipeline = [
            {
                $match: {
                    schedule: {
                        $gte: today,
                        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day (00:00:00.0000 UTC of the next day)
                    },
                    number
                },
            },
            {
                $project: {
                    type: 1,
                    schedule: {
                        $dateToString: {
                            date: '$schedule',
                            format: '%Y-%m-%d',
                            timezone: 'UTC',
                        },
                    },
                    time: 1,
                    amount: 1,
                    rambled: 1,
                    number: 1,
                },
            },
        ];

        const result: IBet[] = await Bet.aggregate(pipeline);
        const total = getNumbersTotalAmount(result);
        const limit = getNumberAndLimitClassification(number).limit;

        return total >= limit;
    } catch (error) {
        console.log('@isSoldOut error', error);
        return false;
    }
};

const getNumbersTotalAmount = (arr: IBet[]): number => {
    let totalAmount = 0;
    for (const obj of arr) {
        totalAmount += obj.amount;
    }
    return totalAmount;
}

const getNumberAndLimitClassification = (number: string): { class: string, limit: number } => {
    const digits: number[] = number.split("").map(Number);
    const digitCounts: { [key: number]: number } = digits.reduce(
        (count: { [key: number]: number }, digit: number) => {
            count[digit] = (count[digit] || 0) + 1;
            return count;
        },{});

    const numDigits: number = digits.length;
    if (Object.values(digitCounts).every((count) => count === 1)) {
        return { class: "unique", limit: 150 };
    } else if (Object.values(digitCounts).some((count) => count === numDigits)) {
        return { class: "triple", limit: 100 };;
    } else {
        return { class: "double", limit: 100 };;
    }
};