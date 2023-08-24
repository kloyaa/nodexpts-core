import Joi from "joi";

export class RequestValidator { 
    createTransactionAPI(body: any) {
        const { error } = Joi.object({
            content: Joi.array().required(),
            schedule: Joi.string().required(),
            total: Joi.number().required(),
            reference: Joi.string().required(),
            game: Joi.string().valid("3D", "STL").required(),
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);

        return error;
    }
    
    deleteBetResultAPI(body: any) {
        const { error } = Joi.object({
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);

        return error;
    }

    registerAPI(body: any) {
        const { error } = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }).validate(body);

        return error;
    }

    getTransactionsAPI(body: any) {
        const { error } = Joi.object({
            game: Joi.string().valid("3D", "STL").optional(),
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").optional(),
            schedule: Joi.string().optional(),
        }).validate(body);

        return error;
    }

    checkNumberAvailabilityAPI(query: any) {
        const { error } = Joi.object({
            schedule: Joi.string().required(),
            time: Joi.string().required(),
            number: Joi.string().required().length(3),
            amount: Joi.number().min(1).required(),
            rambled: Joi.boolean().required(),
            type: Joi.string().valid("3D", "STL").required(),
        }).validate(query);

        return error;
    }

    verifyTokenAPI(body: any) {
        const { error } = Joi.object({
            token: Joi.string().required(),
        }).validate(body);

        return error;
    }
    
    loginAPI(body: any) {
        const { error } = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        }).validate(body);

        return error;
    }

    decryptLogin(body: any) {
        const { error } = Joi.object({
            content: Joi.string().required(),
        }).validate(body);
        return error;
    }
    
    createRoleForUser(body: any) {
        const { error } = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            user: Joi.string().required(),
        }).validate(body);

        return error;
    }

    createProfileAPI(body: any) {
        const { error } = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            birthdate: Joi.string().required(),
            address: Joi.string().required(),
            contactNumber: Joi.string().required(),
            gender: Joi.string().required(),
            refferedBy: Joi.string().optional()
        }).validate(body);

        return error;
    }

    getTransactionsByTokenAPI(query: any) {
        const { error } = Joi.object({
            schedule: Joi.string().optional(),
            game: Joi.string().valid("3D", "STL").required(),
        }).validate(query);

        return error;
    }

    getTransactionsByUserAPI(query: any) {
        const { error } = Joi.object({
            time: Joi.optional(),
            schedule: Joi.string().optional(),
            game: Joi.string().valid("3D", "STL").required(),
            user: Joi.string().required(),
        }).validate(query);

        return error;
    }

    getProfileByLoginIdAPI(query: any) {
        const { error } = Joi.object({
            loginId: Joi.string().required(),
        }).validate(query);

        return error;
    }

    createBetResultAPI(body: any) {
        const { error } = Joi.object({
            type: Joi.string().valid("3D", "STL").required(),
            schedule: Joi.string().optional(),
            number: Joi.string().required().length(3),
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);

        return error;
    }

    getBetResultAPI(body: any) {
        const { error } = Joi.object({
            schedule: Joi.string().required(),
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").required(),
        }).validate(body);

        return error;
    }

    createBetAPI(body: any) {
        const { error } = Joi.object({
            type: Joi.string().valid("3D", "STL").required(),
            schedule: Joi.string().required(),
            time: Joi.string().required(),
            number: Joi.string().required().length(3),
            amount: Joi.number().min(1).required(),
            rambled: Joi.boolean().required(),
        }).validate(body);

        return error;
    }

    getAllBetsAPI(query: any) {
        const { error } = Joi.object({
            type: Joi.string().valid("3D", "STL").optional(),
            user: Joi.string().hex().length(24).optional(),
            time: Joi.string().valid("10:30 AM", "3:00 PM", "8:00 PM", "2:00 PM", "5:00 PM", "9:00 PM").optional(),
            schedule: Joi.date().iso().optional(),
        }).validate(query);

        return error;
    }

    updateProfileVerifiedStatusAPI(body: any) {
        const { error } = Joi.object({
            verified: Joi.boolean().required(),
            user: Joi.string().hex().length(24)
        }).validate(body);;

        return error;
    }
}