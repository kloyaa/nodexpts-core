import { IProfile } from "../interfaces/schema.interface";
import { Profile } from "../models/profile.model";

export const isClientVerified = async (clientId: string) => {
        const profile = await Profile.findOne({ user: clientId }).exec();
        if(profile && !profile.verified) {
            return false;
        } else {
            return true;
        }
}