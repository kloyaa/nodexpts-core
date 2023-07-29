import { Request, Response } from "express";
import { Bet } from "../models/bet.model";
import { RequestValidator } from "../../__core/utils/validation.util";
import { statuses as BetStatuses } from "../const/api-statuses.const";

const validTimeForSTL = ["10:30 AM", "3:00 PM", "8:00 PM"];
const validTimeFor3D = ["2:00 PM", "5:00 PM", "9:00 PM"];
const MAX_LIMITS = {
    target: 150,
    ramble: 900
};

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

        const { type, schedule, time, amount, rambled } = req.body;

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
            rambled
        });
    
        // Save the bet to the database
        const savedBet = await newBet.save();
    
        // Return the newly created bet as the response
        return res.status(201).json(savedBet);
        } catch (error) {
            console.log('@createBet error', error)
            res.status(500).json(error);
    }
};