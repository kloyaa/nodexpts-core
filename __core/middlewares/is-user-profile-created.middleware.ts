import { statuses } from "../const/api-statuses.const";
import { isClientProfileCreated } from "../repositories/user.repositories";

export const isUserProfileCreated = async (req: any, res: any, next: any) => {
    if(!req.user.value) {
        return res.status(403).json({ error: 'Failed to authenticate token.' });
    }
    const isClientProfile = await isClientProfileCreated(req.user.value);
    if(!isClientProfile) {
        res.status(401).json(statuses["0104"]);
        return;
    }

    next();
}