import { statuses } from "../const/api-statuses.const";

require('dotenv').config();

export const maintenanceModeMiddleware = (req:any, res:any, next:any) => {
    if (process.env.ENVIRONMENT_MAINTENANCE === "true") {
        return res.status(500).json(statuses["500"]);
    }
    next();
};
