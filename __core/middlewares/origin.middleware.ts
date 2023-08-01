import { NextFunction, Response } from "express";

export const checkUserOrigin = (req: any, res: Response, next: NextFunction) => {
    const from = req.headers['from'];
    if (!from) {
        return res.status(403).json({ error: 'Invalid or Incorrect origin name.' });
    }
    // Assuming 'from' is a string value, you can modify this logic based on your use case.
    if (from === 'mobile' || from === 'web') {
        req.from = from;
        next();
    } else {
        return res.status(403).json({ error: 'Invalid or Incorrect origin name.' });
    }
}