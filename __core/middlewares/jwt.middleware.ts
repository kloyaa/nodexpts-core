import jwt from 'jsonwebtoken';
import { getAwsSecrets } from '../services/aws.service';
import { isEmpty } from '../utils/methods.util';
import { decrypt } from '../utils/crypto.util';

export const isAuthenticated = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided.' });
    }
        
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }
    const secrets = await getAwsSecrets();
    
    const decryptedToken = decrypt(token, secrets?.CRYPTO_SECRET as string)
    if(!decryptedToken) {
        return res.status(403).json({ error: 'Failed to authenticate token.' });
    }

    if(isEmpty(secrets?.JWT_SECRET_KEY)) {
        return res.status(401).json({ error: "Aws S3 JWT_SECRET is incorrect/invalid"});
    }

    jwt.verify(decryptedToken, secrets?.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token.' });
        }
        req.user = decoded;
    
        next();
    });
}

