import { type Request, type Response } from 'express'
import { type IActivity, type IProfile } from '../../__core/interfaces/schema.interface'
import { Profile } from '../../__core/models/profile.model'
import { statuses } from '../../__core/const/api-statuses.const'
import { RequestValidator } from '../../__core/utils/validation.util'
import { Bet } from '../models/bet.model'
import { getNumbersTotalAmount } from './bet.controller'
import { User } from '../../__core/models/user.model'
import { UserRole } from '../../__core/models/roles.model'
import { isValidObjectId } from 'mongoose'
import { emitter } from '../../__core/events/activity.event'
import { ActivityType, EventName } from '../../__core/enum/activity.enum'

export const updateProfileVerifiedStatus = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    // // Check if there are any validation errors
    const error = new RequestValidator().updateProfileVerifiedStatusAPI(req.body)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { user, verified } = req.body // Assuming the profile ID is provided in the request parameters
    if (!isValidObjectId(user)) {
      return res.status(400).json(statuses['0901'])
    }

    // Find the profile by _id
    const profile: IProfile | null = await Profile.findOne({ user })

    if (!profile) {
      // If profile is not found, return an error
      res.status(404).json(statuses['0104'])
      return
    }

    profile.verified = verified
    await profile.save()

    emitter.emit(EventName.PROFILE_VERIFICATION, {
      user: req.user.value,
      description: ActivityType.PROFILE_VERIFICATION
    } as IActivity)

    res.status(200).json(profile)
  } catch (error) {
    console.log('@updateProfileVerified error', error)
    res.status(500).json(error)
  }
}

export const getDailyTotal = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    const [rambled, target] = await Promise.all([
      Bet.find({ rambled: true }).exec(),
      Bet.find({ rambled: false }).exec()
    ])

    return res.status(200).json({
      rambled: getNumbersTotalAmount(rambled),
      target: getNumbersTotalAmount(target)
    })
  } catch (error) {
    console.log('@getDailyTotal error', error)
    res.status(500).json(error)
  }
}

export const createRoleForUser = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const error = new RequestValidator().createRoleForUser(req.body)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { user, name, description } = req.body
    if (!isValidObjectId(user)) {
      return res.status(400).json(statuses['0901'])
    }
    // Check if the user exists in the database
    const existingUser = await User.findById(user).exec()
    if (!existingUser) {
      return res.status(403).json(statuses['0056'])
    }

    // Create the user role
    const userRole = new UserRole({ user, name, description })

    // Save the user role to the database
    await userRole.save()

    emitter.emit(EventName.ROLE_CREATION, {
      user: user._id,
      description: ActivityType.ROLE_CREATION
    } as IActivity)

    return res.status(201).json(userRole)
  } catch (error) {
    console.error('Error creating user role:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
