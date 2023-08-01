import { Response, NextFunction } from 'express';
import { UserRole } from '../models/roles.model';
import { statuses } from '../const/api-statuses.const';

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Check if the user ID exists on the request object
        const userId = req.user.value;
        if (!userId) {
            return res.status(401).json({ error: 'User ID not found in the request' });
        }

        // Find the user's role based on the user ID
        const userRole = await UserRole.findOne({ user: userId }).exec();

        // Check if the user has the admin role
        if (!userRole || userRole.name !== 'admin') {
            return res.status(401).json(statuses["0057"]);
        }

        // If the user has the admin role, continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('@isAdmin', error)
        res.status(500).json(statuses["0900"]);
    }
};