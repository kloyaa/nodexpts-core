import { Request, Response } from 'express';

export const login = (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Login success"    
    });
}

export const register = (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Register success"    
    });
}

export const logout = (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Logout success"    
    });
}

