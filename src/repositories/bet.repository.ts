import mongoose from 'mongoose'
import { type IBet } from '../interface/bet.interface'
import { Bet } from '../models/bet.model'
import { BetResult } from '../models/bet-result.model'

interface IGetMyBetsRepository {
  time?: string
  type?: string
  schedule?: any
  user: any
}

export const getMyBetsRepository = async (query: IGetMyBetsRepository) => {
  try {
    const { time, type, schedule, user } = query

    const pipeline = []
    if (time || type || schedule) {
      const formattedSchedule = schedule
        ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10)

      const matchStage: any = {}

      if (formattedSchedule) {
        matchStage.$expr = {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
            formattedSchedule
          ]
        }
      }

      if (type) {
        matchStage.type = type
      }
      if (time) {
        matchStage.time = time
      }

      pipeline.push({
        $match: {
          ...matchStage,
          user: new mongoose.Types.ObjectId(user)
        }
      })
    }
    pipeline.push(
      {
        $lookup: {
          from: 'profiles',
          localField: 'user',
          foreignField: 'user',
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
      {
        $project: {
          type: 1,
          number: 1,
          schedule: {
            $dateToString: {
              date: '$schedule',
              format: '%Y-%m-%d',
              timezone: 'UTC'
            }
          },
          time: 1,
          amount: 1,
          rambled: 1,
          reference: 1,
          profile: {
            firstName: 1,
            lastName: 1,
            birthdate: 1,
            address: 1,
            contactNumber: 1,
            gender: 1,
            verified: 1
          }
        }
      }
    )

    const result = await Bet.aggregate(pipeline)
    if (result.length === 0) {
      return []
    }

    const mergedData = result.reduce((result, current) => {
      const existingItem = result.find((item: IBet) => item.reference === current.reference)
      if (existingItem) {
        existingItem.amount += current.amount
      } else {
        result.push({ ...current })
      }
      return result
    }, [])

    return mergedData
  } catch (error) {
    console.log('@getAll error', error)
    throw error
  }
}

export const getBetResultRepository = async (schedule?: string | undefined) => {
  const formattedSchedule = schedule
    ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10)

  console.log(formattedSchedule)
  const aggregationPipeline: any[] = [
    {
      $match: {
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
            formattedSchedule
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        schedule: 1,
        number: 1,
        time: 1,
        type: 1
      }
    }
  ]

  const result = await BetResult.aggregate(aggregationPipeline)
  return result
}
