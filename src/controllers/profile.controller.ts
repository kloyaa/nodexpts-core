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