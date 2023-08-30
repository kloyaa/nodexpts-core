import { type Request, type Response } from 'express'
import { Transaction } from '../models/transaction.model'
import { statuses as betStatuses } from '../const/api-statuses.const'
import { RequestValidator } from '../../__core/utils/validation.util'
import { type IBet } from '../interface/bet.interface'
import { type PipelineStage } from 'mongoose'
import { statuses } from '../../__core/const/api-statuses.const'

// Create a new transaction
export const createTransaction = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const error = new RequestValidator().createTransactionAPI(req.body)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const { content, schedule, time, total, reference, game } = req.body
    const newTransaction = new Transaction({
      user: req.user.value,
      content,
      schedule,
      time,
      total,
      reference,
      game
    })

    await newTransaction.save()
    res.status(201).json(betStatuses['0300'])
  } catch (error) {
    console.error('@createTransaction', error)
    res.status(500).json(betStatuses['0900'])
  }
}

// Get a single transaction by reference
export const getTransactionByReference = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    const reference = req.params.reference
    const transaction = await Transaction.findOne({ reference })

    if (!transaction) {
      return res.status(404).json(betStatuses['0316'])
    }

    res.status(201).json(transaction)
  } catch (error) {
    console.error('@getTransactionByReference', error)
    res.status(500).json(betStatuses['0900'])
  }
}

export const getTransactionsByDate = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    let query = {}

    if (req.query.schedule !== undefined) {
      // Convert the date string to a JavaScript Date object
      query = {
        schedule: new Date(req.query.schedule as string)
      }
    }
    // Get transactions that match the date
    const transactions = await Transaction.find(query)
    return res.status(200).json(transactions)
  } catch (error) {
    console.error('@getTransactionsByDate', error)
    return res.status(500).json(betStatuses['0900'])
  }
}

export const getTransactions = async (req: Request, res: Response): Promise<Response<any>> => {
  try {
    const error = new RequestValidator().getTransactionsAPI(req.query)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    const filter: any = {}
    if (req.query.game) {
      filter.game = req.query.game
    }
    if (req.query.time) {
      filter.time = req.query.time
    }
    if (req.query.schedule) {
      filter.schedule = new Date(req.query.schedule as string)
    }

    // Construct the aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $match: filter
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'user',
          foreignField: 'user',
          as: 'profile'
        }
      },
      // Unwind the 'profile' array to get a single object (since there's one-to-one relation)
      { $unwind: '$profile' },
      {
        $project: {
          _id: 1,
          user: 1,
          content: 1,
          schedule: 1,
          time: 1,
          reference: 1,
          game: 1,
          createdAt: 1,
          updatedAt: 1,
          profile: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
      // Add more stages as needed
    ]

    // Get transactions using the aggregation pipeline
    const transactions = await Transaction.aggregate(pipeline)

    const totalAmount = transactions.reduce((acc, transaction) => {
      const contentAmounts = transaction.content.map((item: any) => item.amount);
      const transactionTotalAmount = contentAmounts.reduce((sum: any, amount: any) => sum + amount, 0);
      return acc + transactionTotalAmount;
    }, 0);

    const numberOf3DTransactions = transactions.filter(transaction => transaction.game === "3D").length;
    const numberOfSTLTransactions = transactions.filter(transaction => transaction.game === "STL").length;

    res
    .status(200)
    .header({ 
      'SWSYA-Txn-Total': totalAmount, 
      'SWSYA-Txn-Revenue': totalAmount * Number(process.env.REVENUE_PERCENT) || 0, 
      'SWSYA-Txn-Count': transactions.length,
      'SWSYA-Stl-Count': numberOfSTLTransactions,
      'SWSYA-Swt-Count': numberOf3DTransactions
    })
    .json(transactions)
  } catch (error) {
    console.error('@getTransactions', error)
    res.status(500).json(betStatuses['0900'])
  }
}

export const getTransactionsByToken = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const error = new RequestValidator().getTransactionsByTokenAPI(req.query)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    let query = {}
    if (req.query.schedule !== undefined) {
      // Convert the date string to a JavaScript Date object
      query = {
        schedule: new Date(req.query.schedule as string)
      }
    }

    // Get transactions that match the date
    const transactions = await Transaction.find({
      ...query,
      game: req.query.game,
      user: req.user.value
    })

    let total = 0
    transactions.forEach(transaction => {
      transaction.content.forEach((item: IBet) => {
        total += item.amount
      })
    })

    res.status(200).json({ transactions, total, count: transactions.length })
  } catch (error) {
    console.error('@getTransactionsByDate', error)
    res.status(500).json(betStatuses['0900'])
  }
}

export const getTransactionsByUser = async (req: Request & { user?: any }, res: Response): Promise<Response<any>> => {
  try {
    const error = new RequestValidator().getTransactionsByUserAPI(req.query)
    if (error) {
      res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, '')
      })
      return
    }

    let query = {}
    if (req.query.schedule !== "" && req.query.schedule !== undefined) {
      query = {
        schedule: new Date(req.query.schedule as string)
      }
    }

    if (req.query.time !== "") {
      query = {
        time: req.query.time
      }
    }

    // Get transactions that match the date
    const transactions = await Transaction.find({
      ...query,
      game: req.query.game,
      user: req.query.user
    })

    let total = 0
    transactions.forEach(transaction => {
      transaction.content.forEach((item: IBet) => {
        total += item.amount
      })
    })

    // Get transactions using the aggregation pipeline

    const totalAmount = transactions.reduce((acc, transaction) => {
      const contentAmounts = transaction.content.map((item: any) => item.amount);
      const transactionTotalAmount = contentAmounts.reduce((sum: any, amount: any) => sum + amount, 0);
      return acc + transactionTotalAmount;
    }, 0);

    const numberOf3DTransactions = transactions.filter(transaction => transaction.game === "3D").length;
    const numberOfSTLTransactions = transactions.filter(transaction => transaction.game === "STL").length;

    return res
      .status(200)
      .header({ 
        'SWSYA-Txn-Total': totalAmount, 
        'SWSYA-Txn-Count': transactions.length,
        'SWSYA-Stl-Count': numberOfSTLTransactions,
        'SWSYA-Swt-Count': numberOf3DTransactions
      })
      .json(transactions)
  } catch (error) {
    console.error('@getTransactionsByDate', error)
    return res.status(500).json(betStatuses['0900'])
  }
}

export const getTransactionData = async (req: Request & { user?: any }, res: Response) => {
  const pipeline: PipelineStage[] = [
    {
      $group: {
        _id: "$schedule",
        total: { $sum: "$total" } // Assuming the field name is "total"
      }
    },
    {
      $project: {
        _id: 0,
        schedule: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$_id"
          }
        },
        total: 1
      }
    },
    {
      $sort: { schedule: 1 }
    }
  ]

  const transactions = await Transaction.aggregate(pipeline)
  return res.status(200).json(transactions);
}