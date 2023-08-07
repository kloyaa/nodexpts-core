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
exports.getTransactionsByUser = exports.getTransactionsByDate = exports.getTransactionByReference = exports.createTransaction = void 0;
const transaction_model_1 = require("../models/transaction.model");
const api_statuses_const_1 = require("../const/api-statuses.const");
const validation_util_1 = require("../../__core/utils/validation.util");
// Create a new transaction
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().createTransactionAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
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
        res.status(201).json(api_statuses_const_1.statuses["0300"]);
    }
    catch (error) {
        console.error("@createTransaction", error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.createTransaction = createTransaction;
// Get a single transaction by reference
const getTransactionByReference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reference = req.params.reference;
        const transaction = yield transaction_model_1.Transaction.findOne({ reference });
        if (!transaction) {
            return res.status(404).json(api_statuses_const_1.statuses["0316"]);
        }
        res.status(201).json(transaction);
    }
    catch (error) {
        console.error("@getTransactionByReference", error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.getTransactionByReference = getTransactionByReference;
const getTransactionsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request data here (e.g., check if the required date parameter is present)
        let query = {};
        if (req.query.schedule !== undefined) {
            // Convert the date string to a JavaScript Date object
            query = {
                schedule: new Date(req.query.schedule)
            };
        }
        // Get transactions that match the date
        const transactions = yield transaction_model_1.Transaction.find(query);
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("@getTransactionsByDate", error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.getTransactionsByDate = getTransactionsByDate;
const getTransactionsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = new validation_util_1.RequestValidator().getTransactionsByUser(req.query);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
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
        console.error("@getTransactionsByDate", error);
        res.status(500).json(api_statuses_const_1.statuses["0900"]);
    }
});
exports.getTransactionsByUser = getTransactionsByUser;
// Add more controller functions for updating, deleting, and listing transactions as needed.
//# sourceMappingURL=transaction.controller.js.map