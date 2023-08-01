import { Types } from 'mongoose';

export const isValidObjectId = (value: any): boolean => {
    try {
    if (!value || typeof value !== 'string') {
        return false;
    }

        return Types.ObjectId.isValid(value);
    } catch (error) {
        console.log("@isValidObjectId", error)
        return false;
    }
}