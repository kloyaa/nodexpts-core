import { Request, Response } from 'express';
import { Transaction } from '../models/transaction.model';
import { statuses } from '../const/api-statuses.const';
import { RequestValidator } from '../../__core/utils/validation.util';
import { isNotEmpty } from '../../__core/utils/methods.util';
import { IBet, ITransaction } from '../interface/bet.interface';

// Create a new transaction
export const createTransaction = async (req: Request & { user?: any }, res: Response) => {
    try {
        const error = new RequestValidator().createTransactionAPI(req.body);
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        const { content, schedule, time, total, reference, game } = req.body;
        const newTransaction = new Transaction({
            user: req.user.value,
            content,
            schedule,
            time,
            total,
            reference,
            game
        });

        await newTransaction.save();
        res.status(201).json(statuses["0300"]);
    } catch (error) {
        console.error("@createTransaction", error);
        res.status(500).json(statuses["0900"]);
    }
};

// Get a single transaction by reference
export const getTransactionByReference = async (req: Request, res: Response) => {
    try {
        const reference = req.params.reference;
        const transaction = await Transaction.findOne({ reference });

        if (!transaction) {
            return res.status(404).json(statuses["0316"]);
        }

        res.status(201).json(transaction);
    } catch (error) {
        console.error("@getTransactionByReference", error);
        res.status(500).json(statuses["0900"]);
    }
};

export const getTransactionsByDate = async (req: Request, res: Response) => {
    try {
    
        // Validate the request data here (e.g., check if the required date parameter is present)
        let query = {};

        if(req.query.schedule !== undefined) {
            // Convert the date string to a JavaScript Date object
            query = { 
                schedule: new Date(req.query.schedule as string) 
            };
        }
        // Get transactions that match the date
        const transactions = await Transaction.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.error("@getTransactionsByDate", error);
        res.status(500).json(statuses["0900"]);
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const error = new RequestValidator().getTransactionsAPI(req.query); // Use req.query instead of req.body
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }

        // Build the filter object based on the optional query parameters
        const filter: any = {};
        if (req.query.game) {
            filter.game = req.query.game;
        }
        if (req.query.time) {
            filter.time = req.query.time;
        }
        if (req.query.schedule) {
            filter.schedule = req.query.schedule;
        }

        // Get transactions that match the filter
        const transactions = await Transaction.find(filter);
        res.status(200).json(transactions);
    } catch (error) {
        console.error("@getTransactions", error);
        res.status(500).json(statuses["0900"]);
    }
};

export const getTransactionsByUser= async (req: Request & { user?: any }, res: Response) => {
    try {
        const error = new RequestValidator().getTransactionsByUser(req.query);
        if (error) {
            res.status(400).json({ 
                error: error.details[0].message.replace(/['"]/g, '') 
            });
            return;
        }
        let query = {};
        if(req.query.schedule !== undefined) {
            // Convert the date string to a JavaScript Date object
            query = { 
                schedule: new Date(req.query.schedule as string) 
            };
        }
        
        // Get transactions that match the date
        const transactions = await Transaction.find({
            ...query,  
            game: req.query.game,            
            user: req.user.value
        });
        
        let total = 0;
        transactions.forEach(transaction => {
            transaction.content.forEach((item: IBet) => {
                total += item.amount;
            });
        });

        res.status(200).json({ transactions, total, count: transactions.length });
    } catch (error) {
        console.error("@getTransactionsByDate", error);
        res.status(500).json(statuses["0900"]);
    }
};

// Add more controller functions for updating, deleting, and listing transactions as needed.
