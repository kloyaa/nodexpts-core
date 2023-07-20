import jwt from 'jsonwebtoken';

export const generateJwt = (value: any, secretKey: string) => {
    const JWT_EXPIRY = '1h';

    return jwt.sign({ value }, secretKey, { expiresIn: JWT_EXPIRY });
}