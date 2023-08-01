import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../../__core/models/user.model';
import { IActivity, IUser } from '../../__core/interfaces/schema.interface';
import { RequestValidator } from '../../__core/utils/validation.util';
import { statuses } from '../../__core/const/api-statuses.const';
import { generateJwt } from '../../__core/utils/jwt.util';
import { encrypt } from '../../__core/utils/crypto.util';
import { getAwsSecrets } from '../../__core/services/aws.service';
import { isEmpty } from '../../__core/utils/methods.util';
import { isClientProfileCreated, isClientVerified } from '../../__core/repositories/user.repositories';
import { emitter } from '../../__core/events/activity.event';
import { ActivityType, EventName } from '../../__core/enum/activity.enum';
import { UserRole } from '../../__core/models/roles.model';

export const login = async (req: Request & { from: string }, res: Response) => {
    try {
        
        // Check if there are any validation errors
        const error = new RequestValidator().loginAPI(req.body)
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }


        const { username, password } = req.body;
                
        // Get secrets
        const secrets = await getAwsSecrets();
        if(isEmpty(secrets)) {
            res.status(401).json(statuses["0300"]);
            return;
        }

        // Check if the user exists based on the username
        const user: IUser | null = await User.findOne({ username }).exec();
        if (!user) {
            // User not found
            res.status(401).json(statuses["0051"]);
            return;
        }

        // Find the user's role based on the user ID
        const userRole = await UserRole.findOne({ user: user._id }).exec();
        
        // Check if the user has the admin role
        if ((userRole.name === 'client') && req.from !== "mobile") {
            return res.status(401).json(statuses["0057"]);
        } 
        else if ((userRole.name === 'admin') && req.from !== "web") {
            return res.status(401).json(statuses["0057"]);
        } 

        // Compare the provided password with the stored hashed password
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Incorrect password
            return res.status(401).json(statuses["0051"]);
        }

        const isClientProfile = await isClientProfileCreated(user._id);
        if(!isClientProfile) {
            return res.status(401).json(statuses["0104"]);
        }

        if (req.from === "mobile") {
            const isVerified = await isClientVerified(user._id);
            if(!isVerified) {
                res.status(401).json(statuses["0055"]);
                return;
            }
        } 

        emitter.emit(EventName.LOGIN, {
            user: user._id,
            description: ActivityType.LOGIN,
        } as IActivity);

        // Generate a JWT token for authentication
        // Return the access token in the response
        return res.status(200).json({ 
            ...statuses["00"], 
            data: encrypt(generateJwt(user._id, secrets?.JWT_SECRET_KEY as string), secrets?.CRYPTO_SECRET!)
        });
    } catch (error) {
        console.log('@login error', error)
        res.status(500).json(error);
    }
};

export const register = async (req: Request & { from: string }, res: Response) => {
    try {
        const { username, email, password } = req.body;
    
        const error = new RequestValidator().registerAPI(req.body)

         // Check if there are any validation errors
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        // Get secrets
        const secrets = await getAwsSecrets();
        if(isEmpty(secrets)) {
            res.status(401).json(statuses["0300"]);
            return;
        }

        // Check if the username or email already exists
        const existingUser = await User.findOne().or([{ username }, { email }]).exec();
        if (existingUser) {
            res.status(403).json(statuses["0052"]);
            return;
        }
    
        // Generate a salt for bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
    
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create a new User document with hashed password and salt
        const newUser: IUser = new User({
            username,
            email,
            password: hashedPassword,
            salt,
        });
        
        // Save the new User document to the database
        const createdUser = await newUser.save();
        let userRole = null;
        
        if (req.from === "mobile") {
            userRole = new UserRole({ 
                user: createdUser._id, 
                name: "client", 
                description: "N/A" 
            });
        } 
        
        if (req.from === "web") {
            userRole = new UserRole({ 
                user: createdUser._id, 
                name: "admin", 
                description: "N/A" 
            });
        } 
        
        await userRole.save();
        
        emitter.emit(EventName.ACCOUNT_CREATION, {
            user: createdUser._id,
            description: ActivityType.ACCOUNT_CREATION,
        } as IActivity);

        return res.status(200).json({ 
            ...statuses["0050"], 
            data: encrypt(generateJwt(createdUser._id, secrets?.JWT_SECRET_KEY as string), secrets?.CRYPTO_SECRET!)
        });
    } catch (error) {
        console.log('@register error', error)
        res.status(500).json(error);
    }
}

export const logout = (req: Request, res: Response) => {
    return res.status(200).json({ 
        message: "Logout success"    
    });
}

