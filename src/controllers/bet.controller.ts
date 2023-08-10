import mongoose from 'mongoose' // Import the mongoose library
import { type Request, type Response } from 'express'
import { Bet, NumberStats } from '../models/bet.model'
import { RequestValidator } from '../../__core/utils/validation.util'
import { statuses as betStatuses } from '../const/api-statuses.const'
import { type IBet, type TNumbeClassification } from '../interface/bet.interface'
import { emitter } from '../events/activity.event'
import { type IActivity } from '../../__core/interfaces/schema.interface'
import { BetActivityType, BetEventName } from '../enum/activity.enum'
import { BetResult } from '../models/bet-result.model'
import { generateReference } from '../../__core/utils/generator.util'
import { getBetResultRepository, getMyBetsRepository } from '../repositories/bet.repository'
import { gtISODate } from '../../__core/utils/date.util'
import { breakCombinations } from '../utils/bet.util'
import { statuses } from '../../__core/const/api-statuses.const'
require('dotenv').config()

const validTimeForSTL = ['10:30 AM', '3:00 PM', '8:00 PM']
const validTimeFor3D = ['2:00 PM', '5:00 PM', '9:00 PM']

export const createBet = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    // Check if there are any validation errors
    const error = new RequestValidator().createBetAPI(req.body)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { type, schedule, time, amount, rambled, number } = req.body

    const isSoldOut = await isSoldOutNumber(number, schedule, time, rambled)
    if (isSoldOut?.full) {
      return res.status(403).json(betStatuses['0312'])
    }
    if ((isSoldOut?.total + amount) > isSoldOut?.limit) {
      return res.status(403).json(betStatuses['0313'])
    }

    if (type === 'STL' && !validTimeForSTL.includes(time)) {
      return res.status(403).json({
        ...betStatuses['0310'], data: `Time ${validTimeForSTL.join(', ')}`
      })
    }

    if (type === '3D' && !validTimeFor3D.includes(time)) {
      return res.status(403).json({
        ...betStatuses['0310'], data: `Time ${validTimeFor3D.join(', ')}`
      })
    }

    // Generate Reference
    const reference = `SWSYA-${generateReference().toUpperCase().slice(0, 4)}-${generateReference().toUpperCase().slice(4)}`
    if (rambled) {
      if (!allowedInRamble(number)) {
        return res.status(403).json(betStatuses['0315'])
      }
      const numbers = breakRambleNumbers(number)
      const splittedValues = numbers.map((num) => ({
        amount: amount / 6,
        number: num,
        user: req.user.value,
        type,
        schedule,
        time,
        rambled,
        reference,
        code: number
      }))

      const [savedBet, _] = await Promise.all([
        Bet.insertMany(splittedValues),
        NumberStats.insertMany(splittedValues)
      ])

      emitter.emit(BetEventName.PLACE_BET, {
        user: req.user.value,
        description: BetActivityType.PLACE_BET
      } as IActivity)

      return res.status(201).json(savedBet)
    } else {
      const newBet = new Bet({
        user: req.user.value,
        type,
        schedule,
        time,
        amount,
        rambled,
        number,
        reference,
        code: number
      })
      const newNumberStat = new NumberStats({
        schedule,
        amount,
        time,
        number,
        user: req.user.value
      })

      // Save the bet to the database
      const [savedBet, _] = await Promise.all([
        newBet.save(),
        newNumberStat.save()
      ])

      emitter.emit(BetEventName.BET_ACTIVITY, {
        user: req.user.value,
        description: BetActivityType.PLACE_BET
      } as IActivity)

      // Return the newly created bet as the response
      return res.status(201).json(savedBet)
    }
  } catch (error) {
    console.log('@createBet error', error)
    res.status(500).json(statuses['0900'])
  }
}

export const createBulkBets = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const bets: IBet[] = Array.isArray(req.body) ? req.body : [req.body]
    const reference = `SWSYA-${generateReference().toUpperCase()}`
    const savedBets: IBet[] = []

    for (const bet of bets) {
      const { type, schedule, time, amount, rambled, number } = bet
      if (rambled) {
        const numbers = breakCombinations(number.toString())
        const splittedValues = numbers.map((num) => ({
          amount: amount / 6,
          number: num,
          user: req.user.value,
          type,
          schedule,
          time,
          rambled,
          reference,
          code: number
        }))

        savedBets.push(...splittedValues)
      } else {
        savedBets.push({
          user: req.user.value,
          type,
          schedule,
          time,
          amount,
          rambled,
          number,
          reference,
          code: number
        })
      }
    }

    await Promise.all([
      Bet.insertMany(savedBets),
      NumberStats.insertMany(savedBets)
    ])

    emitter.emit(BetEventName.PLACE_BET, {
      user: req.user.value,
      description: BetActivityType.PLACE_BET
    } as IActivity)

    return res.status(201).json({
      ...statuses['0300'],
      data: { reference }
    })
  } catch (error) {
    console.log('@createBet error', error)
    return res.status(500).json(statuses['0900'])
  }
}

export const createBetResult = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const error = new RequestValidator().createBetResultAPI(req.body)
  if (error) {
    res.status(400).json({
      ...statuses['501'],
      error: error.details[0].message.replace(/['"]/g, '')
    })
    return
  }

  const { number, schedule, time, type } = req.body

  if (type === 'STL' && !validTimeForSTL.includes(time)) {
    return res.status(403).json({
      ...betStatuses['0310'], data: `Time ${validTimeForSTL.join(', ')}`
    })
  }

  if (type === '3D' && !validTimeFor3D.includes(time)) {
    return res.status(403).json({
      ...betStatuses['0310'], data: `Time ${validTimeFor3D.join(', ')}`
    })
  }

  const formattedSchedule = schedule
    ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10)

  const aggregationPipeline: any[] = [
    {
      $match: {
        $expr: {
          $eq: [
            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
            formattedSchedule
          ]
        },
        time
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
  if (result.length > 0) {
    return res.status(403).json(betStatuses['0314'])
  }

  const newBetResult = new BetResult({
    number,
    schedule,
    time,
    type
  })

  await newBetResult.save()

  emitter.emit(BetEventName.BET_ACTIVITY, {
    user: req.user.value,
    description: BetActivityType.CREATE_BET_RESULT
  } as IActivity)

  return res.status(201).json(statuses['0300'])
}

export const getByReference = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const reference = req.params.reference

  const pipeline = [
    {
      $match: {
        reference,
        user: new mongoose.Types.ObjectId(req.user.value as string)
      }
    },
    { $limit: 1 }
  ]

  const result: IBet = (await Bet.aggregate(pipeline).exec()).at(0)

  if (!result) {
    return res.json(betStatuses['0316'])
  }

  const user = req.user.value.toString() + '2'
  const owner = result.user.toString()

  if (result && user !== owner) {
    return res.json(betStatuses['0317'])
  }

  return res.status(200).json(statuses['0300'])
}

export const getAllBetResults = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const result = await BetResult.find({})
  return res.status(200).json(result)
}

export const getBetResultsBySchedule = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const { schedule } = req.query

  const formattedSchedule = schedule
    ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10)

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
        _id: 1,
        schedule: 1,
        number: 1,
        time: 1,
        type: 1
      }
    }
  ]

  const result = await BetResult.aggregate(aggregationPipeline)
  return res.status(200).json(result)
}

export const deleteBetResult = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const { _id } = req.params

  try {
    const betResult = await BetResult.findByIdAndDelete(_id)

    if (!betResult) {
      return res.status(404).json({ error: 'Bet result not found' })
    }

    emitter.emit(BetEventName.BET_ACTIVITY, {
      user: req.user.value,
      description: BetActivityType.DELETED_BET_RESULT
    } as IActivity)

    return res.json(statuses['0300'])
  } catch (error) {
    console.log('@deleteBetResult error', error)
    res.status(500).json(statuses['0900'])
  }
}

export const getNumberFormulated = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const { schedule } = req.query

    const formattedSchedule = schedule
      ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10)

    const aggregationPipeline: any[] = [
      {
        $lookup: {
          from: 'profiles', // Assuming your User collection is named 'profiles'
          localField: 'user',
          foreignField: 'user',
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
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
          amount: 1,
          number: 1,
          profile: {
            firstName: 1,
            lastName: 1,
            address: 1,
            contactNumber: 1,
            gender: 1
          }
        }
      }
    ]

    const result = await NumberStats.aggregate(aggregationPipeline)
    return res.json(result)
  } catch (error) {
    console.error('@numberStats', error)
    res.status(500).json(statuses['0900'])
  }
}

export const getAllBets = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    // Check if there are any validation errors
    const error = new RequestValidator().getAllBetsAPI(req.query)
    if (error) {
      res.status(400).json({
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { time, type, schedule, user, page: currentPage, limit: currentLimit } = req.query

    const pipeline = []
    if (time || type || schedule || user) {
      // Convert schedule to "YYYY-MM-DD" format for matching
      const formattedSchedule = schedule
        ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10)

      // If any of the query parameters is present, add the $match stage
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
      if (user) {
        matchStage.user = new mongoose.Types.ObjectId(user as string)
      }
      pipeline.push({ $match: matchStage })
    }

    pipeline.push(
      {
        $lookup: {
          from: 'profiles', // Assuming your User collection is named 'profiles'
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
          reference: 1,
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
    console.log(result)
    if (result.length === 0) {
      res.status(200).json([])
      return
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

    return res.status(200).json(mergedData)
  } catch (error) {
    console.log('@getAll error', error)
    res.status(500).json(statuses['0900'])
  }
}

export const getMyBets = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    // Check if there are any validation errors
    const error = new RequestValidator().getAllBetsAPI(req.query)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { time, type, schedule } = req.query

    const pipeline = []
    if (time || type || schedule) {
      // Convert schedule to "YYYY-MM-DD" format for matching
      const formattedSchedule = schedule
        ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10)

      // If any of the query parameters is present, add the $match stage
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
          user: new mongoose.Types.ObjectId(req.user.value as string)
        }
      })
    }
    pipeline.push(
      {
        $lookup: {
          from: 'profiles', // Assuming your User collection is named 'profiles'
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
      res.status(200).json([])
      return
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

    return res.status(200).json(mergedData)
  } catch (error) {
    console.log('@getAll error', error)
    res.status(500).json(statuses['0900'])
  }
}

export const getMyBetResultsWithWins = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  const dateToday = gtISODate()
  const myBets = await getMyBetsRepository({ user: req.user.value, schedule: dateToday })
  const todaysResult = await getBetResultRepository(dateToday)

  return res.status(200).json(winCount(todaysResult, myBets))
}

export const getDailyGross = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    const { schedule } = req.query

    const formattedSchedule = schedule
      ? new Date(schedule as unknown as Date).toISOString().substring(0, 10)
      : new Date().toISOString().substring(0, 10)

    const aggregationPipeline: any[] = [
      {
        $lookup: {
          from: 'profiles', // Assuming your User collection is named 'profiles'
          localField: 'user',
          foreignField: 'user',
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
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
          amount: 1,
          number: 1
        }
      }
    ]

    const result = await NumberStats.aggregate(aggregationPipeline)
    return res.json({
      total: getNumbersTotalAmount(result),
      count: result.length,
      date: formattedSchedule
    })
  } catch (error) {
    console.error('@getDailyTotal', error)
    res.status(500).json(statuses['0900'])
  }
}

export const checkNumberAvailability = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    // Check if there are any validation errors
    const error = new RequestValidator().checkNumberAvailabilityAPI(req.query)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { schedule, time, amount, rambled, number, type } = req.query as any
    const isRambled = rambled === 'true'
    const isSoldOut = await isSoldOutNumber(number, schedule, time, isRambled)
    if (isSoldOut?.full) {
      return res.status(403).json(betStatuses['0312'])
    }
    if ((isSoldOut?.total + amount) > isSoldOut?.limit) {
      return res.status(403).json(betStatuses['0313'])
    }

    if (type === 'STL' && !validTimeForSTL.includes(time)) {
      return res.status(403).json({
        ...betStatuses['0310'], data: `Time ${validTimeForSTL.join(', ')}`
      })
    }

    if (type === '3D' && !validTimeFor3D.includes(time)) {
      return res.status(403).json({
        ...betStatuses['0310'], data: `Time ${validTimeFor3D.join(', ')}`
      })
    }
    if (isRambled) {
      if (!allowedInRamble(number)) {
        return res.status(403).json(betStatuses['0315'])
      }
    }
    return res.status(200).json(betStatuses['0300'])
  } catch (error) {
    console.log('@checkNumberAvailability error', error)
    res.status(500).json(statuses['0900'])
  }
}

const winCount = (dailyResults: any[], bets: any[]): any[] => {
  const winCounts: any[] = []

  dailyResults.forEach((dailyResult) => {
    const { number, type, time, schedule } = dailyResult
    const matchedItems = bets.filter(
      (bet) => {
        return bet.type === type &&
                    bet.time === time &&
                    bet.schedule === schedule.toISOString().substring(0, 10) &&
                    (bet.rambled ? areEquivalentNumbers(bet.number, number) : bet.number === number)
      }
    )

    const wins = matchedItems.length
    winCounts.push({ number, wins, time, type, schedule })
  })

  return winCounts
}

const areEquivalentNumbers = (num1: string, num2: string): boolean => {
  if (num1.length !== num2.length) {
    return false
  }

  const sortedNum1 = num1.split('').sort().join('')
  const sortedNum2 = num2.split('').sort().join('')

  return sortedNum1 === sortedNum2
}

const isSoldOutNumber = async (number: string, schedule: Date, time: string, ramble: boolean): Promise<{ full: boolean, total: number, limit: number } | undefined> => {
  try {
    const pipeline: any[] = [
      {
        $match: {
          time,
          number,
          $expr: {
            $eq: [
              { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
              new Date(schedule as unknown as Date).toISOString().substring(0, 10)
            ]
          }
        }
      }
    ]

    const result: IBet[] = await NumberStats.aggregate(pipeline)
    const total = getNumbersTotalAmount(result)
    const limit = getNumberAndLimitClassification(number, ramble).limit

    return { full: total >= limit, limit, total }
  } catch (error) {
    console.log('@isSoldOut error', error)
  }
}

const allowedInRamble = (combination: string): boolean => {
  return !(combination[0] === combination[1] && combination[1] === combination[2])
}

const breakRambleNumbers = (input: string): string[] => {
  const result = new Set<string>()

  const permute = (str: string, prefix: string = '') => {
    if (str.length === 0) {
      result.add(prefix)
      return
    }

    for (let i = 0; i < str.length; i++) {
      permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i])
    }
  }

  permute(input)

  return Array.from(result)
}

export const getNumbersTotalAmount = (arr: IBet[]): number => {
  let totalAmount = 0
  for (const obj of arr) {
    totalAmount += obj.amount
  }
  return totalAmount
}

const getNumberAndLimitClassification = (number: string, ramble?: boolean): { class: TNumbeClassification, limit: number } => {
  if (ramble) {
    return {
      class: 'ramble',
      limit: Number(process.env.BET_RAMBLE_NUM_LIMIT)
    }
  }

  const digits: number[] = number.split('').map(Number)
  const uniqueDigits = new Set(digits)
  const isDouble = digits.length === 3 && uniqueDigits.size === 2
  const isTriple = uniqueDigits.size === 1

  if (isDouble) {
    return { class: 'double', limit: Number(process.env.BET_DOUBLE_NUM_LIMIT) }
  } else if (isTriple) {
    return { class: 'triple', limit: Number(process.env.BET_TRIPLE_NUM_LIMIT) }
  } else {
    return { class: 'normal', limit: Number(process.env.BET_NORMAL_NUM_LIMIT) }
  }
}
