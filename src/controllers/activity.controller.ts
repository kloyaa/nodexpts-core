import { type Request, type Response } from 'express'
import { statuses } from '../../__core/const/api-statuses.const'
import { Activity } from '../../__core/models/activity.model'
import { type PipelineStage } from 'mongoose'
import { type IActivity } from '../../__core/interfaces/activity.interface'

export const getAllActivityLogs = async (req: Request & { from: string }, res: Response): Promise<Response<IActivity[]>> => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'profiles',
          localField: 'user',
          foreignField: 'user',
          as: 'profile'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },

      // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
      { $unwind: '$profile' },
      { $unwind: '$user' },
      {
        $project: {
          description: 1,
          user: 1,
          profile: {
            user: 1,
            firstName: 1,
            lastName: 1,
            birthdate: 1,
            address: 1,
            contactNumber: 1,
            gender: 1,
            verified: 1,
            createdAt: 1,
            updatedAt: 1,
            refferedBy: 1
          },
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { createdAt: 1 }
      }

    ]

    // Execute the aggregation pipeline
    const result = await Activity.aggregate(pipeline).sort({ createdAt: -1 })
    if (result.length === 0) {
      res.status(200).json([])
      return
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log('@getAllActivityLogs error', error)
    res.status(500).json(statuses['0900'])
  }
}
