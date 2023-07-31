import mongoose, { Cursor } from 'mongoose'; // Import the mongoose library
import { Request, Response } from "express";
import { Bet, NumberStats } from "../models/bet.model";
import { RequestValidator } from "../../__core/utils/validation.util";
import { statuses as BetStatuses } from "../const/api-statuses.const";
import { IBet, TNumbeClassification } from '../interface/bet.interface';
import { emitter } from '../events/activity.event';
import { IActivity } from '../../__core/interfaces/schema.interface';
import { BetActivityType, BetEventName } from '../enum/activity.enum';
import { ObjectId } from 'mongodb';

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

        const isSoldOut = await isSoldOutNumber(number, schedule, time, rambled);
        if(isSoldOut?.full) {
            return res.status(403).json(BetStatuses["0312"]);
        }
        if((isSoldOut?.total + amount) > isSoldOut?.limit!) {
            return res.status(403).json(BetStatuses["0313"]);
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

        if(rambled) {
            const numbers = breakRambleNumbers(number);
            const splittedValues = numbers.map((num) => ({
                amount: amount / 6,
                number: num,
                user: req.user.value,
                type,
                schedule,
                time,
                rambled,
            }));
        
            const [savedBet, _] = await Promise.all([
                Bet.insertMany(splittedValues),
                NumberStats.insertMany(splittedValues)
            ]);

            emitter.emit(BetEventName.PLACE_BET, {
                user: req.user.value,
                description: BetActivityType.PLACE_BET,
            } as IActivity);

            return res.status(201).json(savedBet);
        } else {
            const newBet = new Bet({
                user: req.user.value,
                type,
                schedule,
                time,
                amount,
                rambled,
                number
            });
            const newNumberStat = new NumberStats({
                schedule,
                amount,
                time,
                number,
                user: req.user.value,
            });

            // Save the bet to the database
            const [savedBet, _] = await Promise.all([
                newBet.save(),
                newNumberStat.save()
            ]);

            emitter.emit(BetEventName.PLACE_BET, {
                user: req.user.value,
                description: BetActivityType.PLACE_BET,
            } as IActivity);

            // Return the newly created bet as the response
            return res.status(201).json(savedBet);
        }
        
        } catch (error) {
            console.log('@createBet error', error)
            res.status(500).json(error);
    }
};

export const numberStats = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { schedule } = req.query;

        const formattedSchedule = schedule 
            ? new Date(schedule as unknown as Date).toISOString().substring(0, 10) 
            : new Date().toISOString().substring(0, 10);

        const aggregationPipeline: any[] = [
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
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            formattedSchedule,
                        ],
                    }
                },
            },
            {
                $project: {
                    _id: 0,
                    amount: 1,
                    number: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1
                    }
                },
            },
        ];
    
        const result = await NumberStats.aggregate(aggregationPipeline);
        return res.json(result);
    } catch (error) {
        console.error('@numberStats', error);
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

export const getDailyTotal = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { schedule } = req.query;

        const formattedSchedule = schedule 
            ? new Date(schedule as unknown as Date).toISOString().substring(0, 10) 
            : new Date().toISOString().substring(0, 10);

        const aggregationPipeline: any[] = [
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
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            formattedSchedule,
                        ],
                    },
                    user: new ObjectId(req.user.value)
                },
            },
            {
                $project: {
                    _id: 0,
                    amount: 1,
                    number: 1,
                },
            },
        ];
    
        const result = await NumberStats.aggregate(aggregationPipeline);
        return res.json({ 
            total: getNumbersTotalAmount(result), 
            count: result.length, 
            date: formattedSchedule 
        });
    } catch (error) {
        console.error('@getDailyTotal', error);
        res.status(500).json(error);
    }
}
    
const isSoldOutNumber = async (number: string, schedule: Date, time: string, ramble: boolean): Promise<{ full: boolean, total: number, limit: number } | undefined> => {
        try {
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00.0000 UTC for today
            
            let pipeline: any[] = [
                {
                    $match: {
                        time,
                    number,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            new Date(schedule as unknown as Date).toISOString().substring(0, 10),
                        ],
                    }
                },
            },
        ];
        
        const result: IBet[] = await NumberStats.aggregate(pipeline);
        const total = getNumbersTotalAmount(result);
        const limit = getNumberAndLimitClassification(number, ramble).limit;
        
        console.log({ full: total >= limit, limit, total })
        return { full: total >= limit, limit, total };
    } catch (error) {
        console.log('@isSoldOut error', error);
    }
};

const breakRambleNumbers = (input: string): string[] => {
    const result: string[] = [];

    const permute = (str: string, prefix: string = '') => {
    if (str.length === 0) {
        result.push(prefix);
        return;
    }

    for (let i = 0; i < str.length; i++) {
        permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i]);
    }
    };

    permute(input);

    return result;
};

export const getNumbersTotalAmount = (arr: IBet[]): number => {
    let totalAmount = 0;
    for (const obj of arr) {
        totalAmount += obj.amount;
    }
    return totalAmount;
}

const getNumberAndLimitClassification = (number: string, ramble?: boolean): { class: TNumbeClassification, limit: number } => {
    const digits: number[] = number.split("").map(Number);
    const digitCounts: { [key: number]: number } = digits.reduce(
        (count: { [key: number]: number }, digit: number) => {
            count[digit] = (count[digit] || 0) + 1;
            return count;
        },{});
    
    if(ramble) {
        return { class: "ramble", limit: 900 };;
    }
    
    const numDigits: number = digits.length;
    if (Object.values(digitCounts).every((count) => count === 1)) {
        return { class: "normal", limit: 150 };
    } else if (Object.values(digitCounts).some((count) => count === numDigits)) {
        return { class: "triple", limit: 100 };;
    } else {
        return { class: "double", limit: 100 };;
    }
};