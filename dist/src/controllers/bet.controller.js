"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumbersTotalAmount = exports.getDailyTotal = exports.getAll = exports.numberStats = exports.getBetResult = exports.getAllBetResults = exports.createBetResult = exports.placeBet = void 0;
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose")); // Import the mongoose library
const bet_model_1 = require("../models/bet.model");
const validation_util_1 = require("../../__core/utils/validation.util");
const api_statuses_const_1 = require("../const/api-statuses.const");
const activity_event_1 = require("../events/activity.event");
const activity_enum_1 = require("../enum/activity.enum");
const mongodb_1 = require("mongodb");
const bet_result_model_1 = require("../models/bet-result.model");
const validTimeForSTL = ["10:30 AM", "3:00 PM", "8:00 PM"];
const validTimeFor3D = ["2:00 PM", "5:00 PM", "9:00 PM"];
const placeBet = async (req, res) => {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().createBetAPI(req.body);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { type, schedule, time, amount, rambled, number } = req.body;
        const isSoldOut = await isSoldOutNumber(number, schedule, time, rambled);
        if (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.full) {
            return res.status(403).json(api_statuses_const_1.statuses["0312"]);
        }
        if (((isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.total) + amount) > (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.limit)) {
            return res.status(403).json(api_statuses_const_1.statuses["0313"]);
        }
        if (rambled && (Number(amount) % 6) !== 0) {
            return res.status(403).json(api_statuses_const_1.statuses["0311"]);
        }
        if (type === "STL" && !validTimeForSTL.includes(time)) {
            return res.status(403).json({
                ...api_statuses_const_1.statuses["0310"], data: `Time ${validTimeForSTL.join(", ")}`
            });
        }
        if (type === "3D" && !validTimeFor3D.includes(time)) {
            return res.status(403).json({
                ...api_statuses_const_1.statuses["0310"], data: `Time ${validTimeFor3D.join(", ")}`
            });
        }
        if (rambled) {
            const numbers = breakRambleNumbers(number);
            const splittedValues = numbers.map((num) => ({
                amount: amount / 6,
                number: num,
                user: req.user.value,
                type,
                schedule,
                time,
                rambled,
            }));
            const [savedBet, _] = await Promise.all([
                bet_model_1.Bet.insertMany(splittedValues),
                bet_model_1.NumberStats.insertMany(splittedValues)
            ]);
            activity_event_1.emitter.emit(activity_enum_1.BetEventName.PLACE_BET, {
                user: req.user.value,
                description: activity_enum_1.BetActivityType.PLACE_BET,
            });
            return res.status(201).json(savedBet);
        }
        else {
            const newBet = new bet_model_1.Bet({
                user: req.user.value,
                type,
                schedule,
                time,
                amount,
                rambled,
                number
            });
            const newNumberStat = new bet_model_1.NumberStats({
                schedule,
                amount,
                time,
                number,
                user: req.user.value,
            });
            // Save the bet to the database
            const [savedBet, _] = await Promise.all([
                newBet.save(),
                newNumberStat.save()
            ]);
            activity_event_1.emitter.emit(activity_enum_1.BetEventName.PLACE_BET, {
                user: req.user.value,
                description: activity_enum_1.BetActivityType.PLACE_BET,
            });
            // Return the newly created bet as the response
            return res.status(201).json(savedBet);
        }
    }
    catch (error) {
        console.log('@createBet error', error);
        res.status(500).json(error);
    }
};
exports.placeBet = placeBet;
const createBetResult = async (req, res) => {
    const error = new validation_util_1.RequestValidator().createBetResultAPI(req.body);
    if (error) {
        res.status(400).json({
            error: error.details[0].message.replace(/['"]/g, '')
        });
        return;
    }
    const { number, schedule, time, type } = req.body;
    if (type === "STL" && !validTimeForSTL.includes(time)) {
        return res.status(403).json({
            ...api_statuses_const_1.statuses["0310"], data: `Time ${validTimeForSTL.join(", ")}`
        });
    }
    if (type === "3D" && !validTimeFor3D.includes(time)) {
        return res.status(403).json({
            ...api_statuses_const_1.statuses["0310"], data: `Time ${validTimeFor3D.join(", ")}`
        });
    }
    const formattedSchedule = schedule
        ? new Date(schedule).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10);
    const aggregationPipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                        formattedSchedule,
                    ],
                },
                time
            },
        },
        {
            $project: {
                _id: 0,
                schedule: 1,
                number: 1,
                time: 1,
                type: 1
            },
        },
    ];
    const result = await bet_result_model_1.BetResult.aggregate(aggregationPipeline);
    if (result.length) {
        return res.status(201).json(api_statuses_const_1.statuses["0314"]);
    }
    const newBetResult = new bet_result_model_1.BetResult({
        number,
        schedule,
        time,
        type
    });
    await newBetResult.save();
    return res.status(201).json(api_statuses_const_1.statuses["0300"]);
};
exports.createBetResult = createBetResult;
const getAllBetResults = async (req, res) => {
    const result = await bet_result_model_1.BetResult.find({});
    return res.json(result);
};
exports.getAllBetResults = getAllBetResults;
const getBetResult = async (req, res) => {
    const { schedule } = req.query;
    const formattedSchedule = schedule
        ? new Date(schedule).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10);
    const aggregationPipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                        formattedSchedule,
                    ],
                }
            },
        },
        {
            $project: {
                _id: 0,
                schedule: 1,
                number: 1,
                time: 1,
                type: 1
            },
        },
    ];
    const result = await bet_result_model_1.BetResult.aggregate(aggregationPipeline);
    return res.json(result);
};
exports.getBetResult = getBetResult;
const numberStats = async (req, res) => {
    try {
        const { schedule } = req.query;
        const formattedSchedule = schedule
            ? new Date(schedule).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10);
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'user',
                    foreignField: 'user',
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            formattedSchedule,
                        ],
                    }
                },
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
                },
            },
        ];
        const result = await bet_model_1.NumberStats.aggregate(aggregationPipeline);
        return res.json(result);
    }
    catch (error) {
        console.error('@numberStats', error);
        res.status(500).json(error);
    }
};
exports.numberStats = numberStats;
const getAll = async (req, res) => {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().getAllBetsAPI(req.query);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { time, type, schedule, user } = req.query;
        const pipeline = [];
        if (time || type || schedule || user) {
            // Convert schedule to "YYYY-MM-DD" format for matching
            const formattedSchedule = schedule
                ? new Date(schedule).toISOString().substring(0, 10)
                : new Date().toISOString().substring(0, 10);
            // If any of the query parameters is present, add the $match stage
            const matchStage = {};
            if (formattedSchedule) {
                matchStage.$expr = {
                    $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                        formattedSchedule,
                    ],
                };
            }
            if (type) {
                matchStage.type = type;
            }
            if (time) {
                matchStage.time = time;
            }
            if (user) {
                matchStage.user = new mongoose_1.default.Types.ObjectId(user);
            }
            pipeline.push({ $match: matchStage });
        }
        pipeline.push({
            $lookup: {
                from: 'profiles',
                localField: 'user',
                foreignField: 'user',
                as: 'profile',
            },
        }, {
            $unwind: '$profile',
        }, {
            $project: {
                type: 1,
                schedule: {
                    $dateToString: {
                        date: '$schedule',
                        format: '%Y-%m-%d',
                        timezone: 'UTC',
                    },
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
                    verified: 1,
                },
            },
        });
        const result = await bet_model_1.Bet.aggregate(pipeline);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('@getAll error', error);
        res.status(500).json(error);
    }
};
exports.getAll = getAll;
const getDailyTotal = async (req, res) => {
    try {
        const { schedule } = req.query;
        const formattedSchedule = schedule
            ? new Date(schedule).toISOString().substring(0, 10)
            : new Date().toISOString().substring(0, 10);
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'user',
                    foreignField: 'user',
                    as: 'profile',
                },
            },
            {
                $unwind: '$profile',
            },
            {
                $match: {
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            formattedSchedule,
                        ],
                    },
                    user: new mongodb_1.ObjectId(req.user.value)
                },
            },
            {
                $project: {
                    _id: 0,
                    amount: 1,
                    number: 1,
                },
            },
        ];
        const result = await bet_model_1.NumberStats.aggregate(aggregationPipeline);
        return res.json({
            total: (0, exports.getNumbersTotalAmount)(result),
            count: result.length,
            date: formattedSchedule
        });
    }
    catch (error) {
        console.error('@getDailyTotal', error);
        res.status(500).json(error);
    }
};
exports.getDailyTotal = getDailyTotal;
const isSoldOutNumber = async (number, schedule, time, ramble) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00.0000 UTC for today
        let pipeline = [
            {
                $match: {
                    time,
                    number,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            new Date(schedule).toISOString().substring(0, 10),
                        ],
                    }
                },
            },
        ];
        const result = await bet_model_1.NumberStats.aggregate(pipeline);
        const total = (0, exports.getNumbersTotalAmount)(result);
        const limit = getNumberAndLimitClassification(number, ramble).limit;
        console.log({ full: total >= limit, limit, total });
        return { full: total >= limit, limit, total };
    }
    catch (error) {
        console.log('@isSoldOut error', error);
    }
};
const breakRambleNumbers = (input) => {
    const result = [];
    const permute = (str, prefix = '') => {
        if (str.length === 0) {
            result.push(prefix);
            return;
        }
        for (let i = 0; i < str.length; i++) {
            permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i]);
        }
    };
    permute(input);
    return result;
};
const getNumbersTotalAmount = (arr) => {
    let totalAmount = 0;
    for (const obj of arr) {
        totalAmount += obj.amount;
    }
    return totalAmount;
};
exports.getNumbersTotalAmount = getNumbersTotalAmount;
const getNumberAndLimitClassification = (number, ramble) => {
    const digits = number.split("").map(Number);
    const digitCounts = digits.reduce((count, digit) => {
        count[digit] = (count[digit] || 0) + 1;
        return count;
    }, {});
    if (ramble) {
        return {
            class: "ramble",
            limit: Number(process.env.BET_RAMBLE_NUM_LIMIT)
        };
    }
    const numDigits = digits.length;
    if (Object.values(digitCounts).every((count) => count === 1)) {
        return {
            class: "normal",
            limit: Number(process.env.BET_NORMAL_NUM_LIMIT)
        };
    }
    else if (Object.values(digitCounts).some((count) => count === numDigits)) {
        return {
            class: "triple",
            limit: Number(process.env.BET_TRIPLE_NUM_LIMIT)
        };
        ;
    }
    else {
        return {
            class: "double",
            limit: Number(process.env.BET_DOUBLE_NUM_LIMIT)
        };
        ;
    }
};
