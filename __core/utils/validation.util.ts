import Joi from "joi";
import mongoose from 'mongoose';

export class RequestValidator { 
    registerAPI(body: any) {
        const { error } = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }).validate(body);

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
        }).validate(body);

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
            schedule: Joi.string().required(),
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