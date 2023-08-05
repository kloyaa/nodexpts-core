require('dotenv').config();
import { Request, Response } from "express";

export const getBetConfigs = (req: Request & { user?: any }, res: Response) => {
    try {
        const envVars = {
            ENVIRONMENT: process.env.ENVIRONMENT,
            ENVIRONMENT_MAINTENANCE: process.env.ENVIRONMENT_MAINTENANCE,
            PORT: process.env.PORT,
            DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
            DB_CONNECTION_STRING_LOCAL: process.env.DB_CONNECTION_STRING_LOCAL,
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
            AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
            BET_DOUBLE_NUM_LIMIT: process.env.BET_DOUBLE_NUM_LIMIT,
            BET_TRIPLE_NUM_LIMIT: process.env.BET_TRIPLE_NUM_LIMIT,
            BET_NORMAL_NUM_LIMIT: process.env.BET_NORMAL_NUM_LIMIT,
            BET_RAMBLE_NUM_LIMIT: process.env.BET_RAMBLE_NUM_LIMIT,
            BET_WIN_PER_PESO: process.env.BET_WIN_PER_PESO,
        };
        return res.status(200).json(envVars);
    } catch (error) {
        console.log('@getBetConfigs error', error)
        return res.status(500).json(error);
    }
}