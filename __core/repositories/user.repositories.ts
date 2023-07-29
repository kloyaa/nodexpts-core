import { Profile } from "../models/profile.model";

// Checking
export const isClientProfileCreated = async (clientId: string) => {
    const profile = await Profile.findOne({ user: clientId }).exec();
    if(profile !== null) {
        return true;
    } else {
        return false;
    }
}

export const isClientVerified = async (clientId: string) => {
    const profile = await Profile.findOne({ user: clientId }).exec();
    if(profile?.verified === true && profile !== null) {
        return true;
    } else {
        return false;
    }
}