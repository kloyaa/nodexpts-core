import EventEmitter from 'eventemitter3'
import { BetEventName } from '../enum/activity.enum'
import { type IActivity } from '../../__core/interfaces/schema.interface'
import { Activity } from '../../__core/models/activity.model'

// Create an EventEmitter instance
export const emitter = new EventEmitter()

// Event listener for 'login-activity' event
emitter.on(BetEventName.PLACE_BET, async (payload: IActivity) => {
  try {
    // Create a new Activity document
    const newActivity: IActivity = new Activity({
      user: payload.user,
      description: payload.description
    })

    // Save the new activity log to the database
    await newActivity.save()
    console.log({ activity: payload.description })
  } catch (error) {
    console.error(`@${BetEventName.PLACE_BET} error`, error)
  }
})

// Event listener for 'login-activity' event
emitter.on(BetEventName.BET_ACTIVITY, async (payload: IActivity) => {
  try {
    // Create a new Activity document
    const newActivity: IActivity = new Activity({
      user: payload.user,
      description: payload.description
    })

    // Save the new activity log to the database
    await newActivity.save()
    console.log({ activity: payload.description })
  } catch (error) {
    console.error(`@${payload.description} error`, error)
  }
})
