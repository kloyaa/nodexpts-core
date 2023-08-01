import { Request, Response } from 'express';
import { IProfile } from '../../__core/interfaces/schema.interface';
import { Profile } from '../../__core/models/profile.model';
import { statuses } from '../../__core/const/api-statuses.const';
import { RequestValidator } from '../../__core/utils/validation.util';
import { Bet } from '../models/bet.model';
import { getNumbersTotalAmount } from './bet.controller';

// Patch request to update the 'verified' field of a profile
export const updateProfileVerifiedStatus = async (req: Request, res: Response) => {
    try {
        // // Check if there are any validation errors
        const error = new RequestValidator().updateProfileVerifiedStatusAPI(req.body)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

            
        const { user, verified } = req.body; // Assuming the profile ID is provided in the request parameters

        // Find the profile by _id
        const profile: IProfile | null = await Profile.findOne({ user });

        if (!profile) {
        // If profile is not found, return an error
            res.status(404).json(statuses["0104"]);
            return;
        }

        profile.verified = verified;
        await profile.save();

        res.status(200).json(profile);
    } catch (error) {
        console.log('@updateProfileVerified error', error);
        res.status(500).json(error);
    }
};

export const getDailyTotal = async (req: Request, res: Response) => {
    try {
        const [rambled, target] = await Promise.all([
            Bet.find({ rambled: true }).exec(),
            Bet.find({ rambled: false }).exec()
        ])

        return res.status(200).json({
            rambled: getNumbersTotalAmount(rambled),
            target: getNumbersTotalAmount(target)
        });
    } catch (error) {
        console.log('@getDailyTotal error', error)
        res.status(500).json(error);
    }
}
