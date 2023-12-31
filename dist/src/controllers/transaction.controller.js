"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyTransactionData = exports.getTransactionData = exports.getTransactionsByUser = exports.getTransactionsByToken = exports.getTransactions = exports.getTransactionsByDate = exports.getTransactionByReference = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction.model");
const api_statuses_const_1 = require("../const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
const api_statuses_const_2 = require("../../__core/const/api-statuses.const");
const mongodb_1 = require("mongodb");
// Create a new transaction
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().createTransactionAPI(req.body);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { content, schedule, time, total, reference, game } = req.body;
        const newTransaction = new transaction_model_1.Transaction({
            user: req.user.value,
            content,
            schedule,
            time,
            total,
            reference,
            game
        });
        yield newTransaction.save();
        res.status(201).json(api_statuses_const_1.statuses['0300']);
    }
    catch (error) {
        console.error('@createTransaction', error);
        res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.createTransaction = createTransaction;
// Get a single transaction by reference
const getTransactionByReference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reference = req.params.reference;
        const transaction = yield transaction_model_1.Transaction.findOne({ reference });
        if (!transaction) {
            return res.status(404).json(api_statuses_const_1.statuses['0316']);
        }
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error('@getTransactionByReference', error);
        res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getTransactionByReference = getTransactionByReference;
const getTransactionsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        if (req.query.schedule !== undefined) {
            // Convert the date string to a JavaScript Date object
            query = {
                schedule: new Date(req.query.schedule)
            };
        }
        // Get transactions that match the date
        const transactions = yield transaction_model_1.Transaction.find(query);
        return res.status(200).json(transactions);
    }
    catch (error) {
        console.error('@getTransactionsByDate', error);
        return res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getTransactionsByDate = getTransactionsByDate;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().getTransactionsAPI(req.query);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const filter = {};
        if (req.query.game) {
            filter.game = req.query.game;
        }
        if (req.query.time) {
            filter.time = req.query.time;
        }
        if (req.query.schedule) {
            filter.schedule = new Date(req.query.schedule);
        }
        // Construct the aggregation pipeline
        const pipeline = [
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
        ];
        // Get transactions using the aggregation pipeline
        const transactions = yield transaction_model_1.Transaction.aggregate(pipeline);
        const totalAmount = transactions.reduce((acc, transaction) => {
            const contentAmounts = transaction.content.map((item) => item.amount);
            const transactionTotalAmount = contentAmounts.reduce((sum, amount) => sum + amount, 0);
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
            .json(transactions);
    }
    catch (error) {
        console.error('@getTransactions', error);
        res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getTransactions = getTransactions;
const getTransactionsByToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().getTransactionsByTokenAPI(req.query);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        let query = {};
        if (req.query.schedule !== undefined) {
            // Convert the date string to a JavaScript Date object
            query = {
                schedule: new Date(req.query.schedule)
            };
        }
        // Get transactions that match the date
        const transactions = yield transaction_model_1.Transaction.find(Object.assign(Object.assign({}, query), { game: req.query.game, user: req.user.value }));
        let total = 0;
        transactions.forEach(transaction => {
            transaction.content.forEach((item) => {
                total += item.amount;
            });
        });
        res.status(200).json({ transactions, total, count: transactions.length });
    }
    catch (error) {
        console.error('@getTransactionsByDate', error);
        res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getTransactionsByToken = getTransactionsByToken;
const getTransactionsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().getTransactionsByUserAPI(req.query);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        let query = {};
        if (req.query.schedule !== "" && req.query.schedule !== undefined) {
            query = {
                schedule: new Date(req.query.schedule)
            };
        }
        if (req.query.time !== "") {
            query = {
                time: req.query.time
            };
        }
        // Get transactions that match the date
        const transactions = yield transaction_model_1.Transaction.find(Object.assign(Object.assign({}, query), { game: req.query.game, user: req.query.user }));
        let total = 0;
        transactions.forEach(transaction => {
            transaction.content.forEach((item) => {
                total += item.amount;
            });
        });
        // Get transactions using the aggregation pipeline
        const totalAmount = transactions.reduce((acc, transaction) => {
            const contentAmounts = transaction.content.map((item) => item.amount);
            const transactionTotalAmount = contentAmounts.reduce((sum, amount) => sum + amount, 0);
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
            .json(transactions);
    }
    catch (error) {
        console.error('@getTransactionsByDate', error);
        return res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getTransactionsByUser = getTransactionsByUser;
const getTransactionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
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
    ];
    const transactions = yield transaction_model_1.Transaction.aggregate(pipeline);
    return res.status(200).json(transactions);
});
exports.getTransactionData = getTransactionData;
const getMyTransactionData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query.user);
    const pipeline = [
        {
            $match: {
                user: new mongodb_1.ObjectId(req.query.user)
            }
        },
        {
            $group: {
                _id: "$schedule",
                total: { $sum: "$total" }
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
    ];
    const transactions = yield transaction_model_1.Transaction.aggregate(pipeline);
    return res.status(200).json(transactions);
});
exports.getMyTransactionData = getMyTransactionData;
//# sourceMappingURL=transaction.controller.js.map