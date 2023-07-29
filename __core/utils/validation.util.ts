import Joi from "joi";

export class RequestValidator { 
    registerAPI(body: any) {
        const { error } = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
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
    
    createProfileAPI(body: any) {
        const { error } = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            birthdate: Joi.string().required(),
            address: Joi.string().required(),
            contactNumber: Joi.string().required(),
            gender: Joi.string().required(),
        }).validate(body);

        return error;
    }

    getProfileByLoginIdAPI(query: any) {
        const { error } = Joi.object({
            loginId: Joi.string().required(),
        }).validate(query);

        return error;
    }
}