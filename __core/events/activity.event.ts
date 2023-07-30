import EventEmitter from 'eventemitter3';
import { IActivity } from '../interfaces/schema.interface';
import { Activity } from '../models/activity.model';
import { EventName } from '../enum/activity.enum';

// Create an EventEmitter instance
export const emitter = new EventEmitter();

// Event listener for 'login-activity' event
emitter.on(EventName.LOGIN, async (payload: IActivity) => {
    try {
        // Create a new Activity document
        const newActivity: IActivity = new Activity({
            user: payload.user,
            description: payload.description,
        });

        // Save the new activity log to the database
        await newActivity.save();
        console.log({ activity: payload.description })
    } catch (error) {
        console.error(`@${EventName.LOGIN} error`, error);
    }
});

emitter.on(EventName.ACCOUNT_CREATION, async (payload: IActivity) => {
    try {
        // Create a new Activity document
        const newActivity: IActivity = new Activity({
            user: payload.user,
            description: payload.description,
        });

        // Save the new activity log to the database
        await newActivity.save();
        console.log({ activity: payload.description })
    } catch (error) {
        console.error(`@${EventName.ACCOUNT_CREATION} error`, error);
    }
});
