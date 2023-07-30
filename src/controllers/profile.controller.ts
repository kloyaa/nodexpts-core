import { Request, Response } from "express";
import { IProfile } from "../../__core/interfaces/schema.interface";
import { Profile } from "../../__core/models/profile.model";
import { User } from "../../__core/models/user.model";
import { statuses } from "../../__core/const/api-statuses.const";
import { RequestValidator } from "../../__core/utils/validation.util";

export const create = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
        
        // Check if there are any validation errors
        const error = new RequestValidator().createProfileAPI(req.body)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }
        
        const { firstName, lastName, birthdate, address, contactNumber, gender } = req.body;
        // Check if the user exists
        const user = await User.findById(req.user.value);
        if (!user) {
            res.status(404).json(statuses["0055"]);
            return;
        }
        // Check if profile already exist
        const profile = await Profile.findOne({ user }).exec()
        if(profile) {
            res.status(404).json(statuses["0103"]);
            return;
        }
        
        // Create a new Profile document and associate it with the user
        const newProfile: IProfile = new Profile({
            user: user._id,
            firstName,
            lastName,
            birthdate,
            address,
            contactNumber,
            gender,
        });

        // Save the new Profile document to the database
        await newProfile.save();

        res.status(201).json(statuses["0100"]);
    } catch (error) {
        res.status(500).json(statuses["0900"]);
    }
}

export const getProfileByLoginId = async (req: Request, res: Response) => {
    try {
        // Check if there are any validation errors
        const error = new RequestValidator().getProfileByLoginIdAPI(req.query)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        const pipeline = [
            // Match the User collection to find the user by their username
            {  
                $match: { 
                    $or: [
                        { username: req.query.loginId }, 
                        { email: req.query.loginId }
                    ] 
                } 
            },
            // Lookup the Profile collection to get the profile associated with the user
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
            // Project only the required fields for the user and the profile
            {
                $project: {
                    username: 1,
                    email: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1
                    }
                }
            }
        ];

        // Execute the aggregation pipeline
        const result = await User.aggregate(pipeline);
        if (result.length === 0) {
            res.status(403).json(statuses["0104"]);
            return;
        }
        // Return the user object along with the user's profile
        return res.status(200).json(result[0]);
    } catch (error) {
        console.log('@getProfileByUsername error', error)
        res.status(500).json(error);
    }
};

export const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const { verified } = req.query;

        const pipeline = [
            // Lookup the Profile collection to get the profile associated with the user
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'profile'
                }
            },
            // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
            { $unwind: '$profile' },
               // Match only the users with verified profiles
            ...(typeof verified === 'boolean' || verified === 'true' || verified === 'false'
               ? [{ $match: { 'profile.verified': verified === 'true' ? true : false } }]
               : []),
            // Project only the required fields for the user and the profile
            {
                $project: {
                    username: 1,
                    email: 1,
                    profile: {
                        firstName: 1,
                        lastName: 1,
                        birthdate: 1,
                        address: 1,
                        contactNumber: 1,
                        gender: 1,
                        verified: 1
                    }
                }
            }
        ];

        // Execute the aggregation pipeline
        const result = await User.aggregate(pipeline);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log('@getAllActiveProfiles error', error)
        res.status(500).json(error);
    }
}
