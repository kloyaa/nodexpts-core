import jwt from 'jsonwebtoken';
import { JwtExpiry } from '../enum/jwt.enum';

export const generateJwt = (value: any, secretKey: string) => {
    const JWT_EXPIRY = JwtExpiry.ONE_HOUR;

    return jwt.sign({ value }, secretKey, { expiresIn: JWT_EXPIRY });
}