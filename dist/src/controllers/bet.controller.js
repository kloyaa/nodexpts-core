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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumbersTotalAmount = exports.checkNumberAvailability = exports.getDailyGross = exports.getMyBetResultsWithWins = exports.getMyBets = exports.getAllBets = exports.getNumberFormulated = exports.deleteBetResult = exports.getBetResultsBySchedule = exports.getAllBetResults = exports.getByReference = exports.createBetResult = exports.createBulkBets = exports.createBet = void 0;
const mongoose_1 = __importDefault(require("mongoose")); // Import the mongoose library
const bet_model_1 = require("../models/bet.model");
const validation_util_1 = require("../../__core/utils/validation.util");
const api_statuses_const_1 = require("../const/api-statuses.const");
const activity_event_1 = require("../events/activity.event");
const activity_enum_1 = require("../enum/activity.enum");
const bet_result_model_1 = require("../models/bet-result.model");
const generator_util_1 = require("../../__core/utils/generator.util");
const bet_repository_1 = require("../repositories/bet.repository");
const date_util_1 = require("../../__core/utils/date.util");
const bet_util_1 = require("../utils/bet.util");
const api_statuses_const_2 = require("../../__core/const/api-statuses.const");
require('dotenv').config();
const validTimeForSTL = ['10:30 AM', '3:00 PM', '8:00 PM'];
const validTimeFor3D = ['2:00 PM', '5:00 PM', '9:00 PM'];
const createBet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().createBetAPI(req.body);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { type, schedule, time, amount, rambled, number } = req.body;
        const isSoldOut = yield isSoldOutNumber(number, schedule, time, rambled);
        if (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.full) {
            return res.status(403).json(api_statuses_const_1.statuses['0312']);
        }
        if (((isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.total) + amount) > (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.limit)) {
            return res.status(403).json(api_statuses_const_1.statuses['0313']);
        }
        if (type === 'STL' && !validTimeForSTL.includes(time)) {
            return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeForSTL.join(', ')}` }));
        }
        if (type === '3D' && !validTimeFor3D.includes(time)) {
            return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeFor3D.join(', ')}` }));
        }
        // Generate Reference
        const reference = `SWSYA-${(0, generator_util_1.generateReference)().toUpperCase().slice(0, 4)}-${(0, generator_util_1.generateReference)().toUpperCase().slice(4)}`;
        if (rambled) {
            if (!allowedInRamble(number)) {
                return res.status(403).json(api_statuses_const_1.statuses['0315']);
            }
            const numbers = breakRambleNumbers(number);
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
            }));
            const [savedBet, _] = yield Promise.all([
                bet_model_1.Bet.insertMany(splittedValues),
                bet_model_1.NumberStats.insertMany(splittedValues)
            ]);
            activity_event_1.emitter.emit(activity_enum_1.BetEventName.PLACE_BET, {
                user: req.user.value,
                description: activity_enum_1.BetActivityType.PLACE_BET
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
                number,
                reference,
                code: number
            });
            const newNumberStat = new bet_model_1.NumberStats({
                schedule,
                amount,
                time,
                number,
                user: req.user.value
            });
            // Save the bet to the database
            const [savedBet, _] = yield Promise.all([
                newBet.save(),
                newNumberStat.save()
            ]);
            activity_event_1.emitter.emit(activity_enum_1.BetEventName.BET_ACTIVITY, {
                user: req.user.value,
                description: activity_enum_1.BetActivityType.PLACE_BET
            });
            // Return the newly created bet as the response
            return res.status(201).json(savedBet);
        }
    }
    catch (error) {
        console.log('@createBet error', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.createBet = createBet;
const createBulkBets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bets = Array.isArray(req.body) ? req.body : [req.body];
        const reference = `SWSYA-${(0, generator_util_1.generateReference)().toUpperCase()}`;
        const savedBets = [];
        for (const bet of bets) {
            const { type, schedule, time, amount, rambled, number } = bet;
            if (rambled) {
                const numbers = (0, bet_util_1.breakCombinations)(number.toString());
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
                }));
                savedBets.push(...splittedValues);
            }
            else {
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
                });
            }
        }
        yield Promise.all([
            bet_model_1.Bet.insertMany(savedBets),
            bet_model_1.NumberStats.insertMany(savedBets)
        ]);
        activity_event_1.emitter.emit(activity_enum_1.BetEventName.PLACE_BET, {
            user: req.user.value,
            description: activity_enum_1.BetActivityType.PLACE_BET
        });
        return res.status(201).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['0300']), { data: { reference } }));
    }
    catch (error) {
        console.log('@createBet error', error);
        return res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.createBulkBets = createBulkBets;
const createBetResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = new validation_util_1.RequestValidator().createBetResultAPI(req.body);
    if (error) {
        res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
        return;
    }
    const { number, schedule, time, type } = req.body;
    if (type === 'STL' && !validTimeForSTL.includes(time)) {
        return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeForSTL.join(', ')}` }));
    }
    if (type === '3D' && !validTimeFor3D.includes(time)) {
        return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeFor3D.join(', ')}` }));
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
    ];
    const result = yield bet_result_model_1.BetResult.aggregate(aggregationPipeline);
    if (result.length > 0) {
        return res.status(403).json(api_statuses_const_1.statuses['0314']);
    }
    const newBetResult = new bet_result_model_1.BetResult({
        number,
        schedule,
        time,
        type
    });
    yield newBetResult.save();
    activity_event_1.emitter.emit(activity_enum_1.BetEventName.BET_ACTIVITY, {
        user: req.user.value,
        description: activity_enum_1.BetActivityType.CREATE_BET_RESULT
    });
    return res.status(201).json(api_statuses_const_2.statuses['0300']);
});
exports.createBetResult = createBetResult;
const getByReference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reference = req.params.reference;
    const pipeline = [
        {
            $match: {
                reference,
                user: new mongoose_1.default.Types.ObjectId(req.user.value)
            }
        },
        { $limit: 1 }
    ];
    const result = (yield bet_model_1.Bet.aggregate(pipeline).exec()).at(0);
    if (!result) {
        return res.json(api_statuses_const_1.statuses['0316']);
    }
    const user = req.user.value.toString() + '2';
    const owner = result.user.toString();
    if (result && user !== owner) {
        return res.json(api_statuses_const_1.statuses['0317']);
    }
    return res.status(200).json(api_statuses_const_2.statuses['0300']);
});
exports.getByReference = getByReference;
const getAllBetResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bet_result_model_1.BetResult.find({});
    return res.status(200).json(result);
});
exports.getAllBetResults = getAllBetResults;
const getBetResultsBySchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    ];
    const result = yield bet_result_model_1.BetResult.aggregate(aggregationPipeline);
    return res.status(200).json(result);
});
exports.getBetResultsBySchedule = getBetResultsBySchedule;
const deleteBetResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const betResult = yield bet_result_model_1.BetResult.findByIdAndDelete(_id);
        if (!betResult) {
            return res.status(404).json({ error: 'Bet result not found' });
        }
        activity_event_1.emitter.emit(activity_enum_1.BetEventName.BET_ACTIVITY, {
            user: req.user.value,
            description: activity_enum_1.BetActivityType.DELETED_BET_RESULT
        });
        return res.json(api_statuses_const_2.statuses['0300']);
    }
    catch (error) {
        console.log('@deleteBetResult error', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.deleteBetResult = deleteBetResult;
const getNumberFormulated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        ];
        const result = yield bet_model_1.NumberStats.aggregate(aggregationPipeline);
        return res.json(result);
    }
    catch (error) {
        console.error('@numberStats', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.getNumberFormulated = getNumberFormulated;
const getAllBets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().getAllBetsAPI(req.query);
        if (error) {
            res.status(400).json({
                error: error.details[0].message.replace(/['"]/g, '')
            });
            return;
        }
        const { time, type, schedule, user, page: currentPage, limit: currentLimit } = req.query;
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
                        formattedSchedule
                    ]
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
                as: 'profile'
            }
        }, {
            $unwind: '$profile'
        }, {
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
        });
        const result = yield bet_model_1.Bet.aggregate(pipeline);
        console.log(result);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        const mergedData = result.reduce((result, current) => {
            const existingItem = result.find((item) => item.reference === current.reference);
            if (existingItem) {
                existingItem.amount += current.amount;
            }
            else {
                result.push(Object.assign({}, current));
            }
            return result;
        }, []);
        return res.status(200).json(mergedData);
    }
    catch (error) {
        console.log('@getAll error', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.getAllBets = getAllBets;
const getMyBets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().getAllBetsAPI(req.query);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { time, type, schedule } = req.query;
        const pipeline = [];
        if (time || type || schedule) {
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
                        formattedSchedule
                    ]
                };
            }
            if (type) {
                matchStage.type = type;
            }
            if (time) {
                matchStage.time = time;
            }
            pipeline.push({
                $match: Object.assign(Object.assign({}, matchStage), { user: new mongoose_1.default.Types.ObjectId(req.user.value) })
            });
        }
        pipeline.push({
            $lookup: {
                from: 'profiles',
                localField: 'user',
                foreignField: 'user',
                as: 'profile'
            }
        }, {
            $unwind: '$profile'
        }, {
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
        });
        const result = yield bet_model_1.Bet.aggregate(pipeline);
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        const mergedData = result.reduce((result, current) => {
            const existingItem = result.find((item) => item.reference === current.reference);
            if (existingItem) {
                existingItem.amount += current.amount;
            }
            else {
                result.push(Object.assign({}, current));
            }
            return result;
        }, []);
        return res.status(200).json(mergedData);
    }
    catch (error) {
        console.log('@getAll error', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.getMyBets = getMyBets;
const getMyBetResultsWithWins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dateToday = (0, date_util_1.gtISODate)();
    const myBets = yield (0, bet_repository_1.getMyBetsRepository)({ user: req.user.value, schedule: dateToday });
    const todaysResult = yield (0, bet_repository_1.getBetResultRepository)(dateToday);
    return res.status(200).json(winCount(todaysResult, myBets));
});
exports.getMyBetResultsWithWins = getMyBetResultsWithWins;
const getDailyGross = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        ];
        const result = yield bet_model_1.NumberStats.aggregate(aggregationPipeline);
        return res.json({
            total: (0, exports.getNumbersTotalAmount)(result),
            count: result.length,
            date: formattedSchedule
        });
    }
    catch (error) {
        console.error('@getDailyTotal', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.getDailyGross = getDailyGross;
const checkNumberAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if there are any validation errors
        const error = new validation_util_1.RequestValidator().checkNumberAvailabilityAPI(req.query);
        if (error) {
            res.status(400).json(Object.assign(Object.assign({}, api_statuses_const_2.statuses['501']), { error: error.details[0].message.replace(/['"]/g, '') }));
            return;
        }
        const { schedule, time, amount, rambled, number, type } = req.query;
        const isRambled = rambled === 'true';
        const isSoldOut = yield isSoldOutNumber(number, schedule, time, isRambled);
        if (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.full) {
            return res.status(403).json(api_statuses_const_1.statuses['0312']);
        }
        if (((isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.total) + amount) > (isSoldOut === null || isSoldOut === void 0 ? void 0 : isSoldOut.limit)) {
            return res.status(403).json(api_statuses_const_1.statuses['0313']);
        }
        if (type === 'STL' && !validTimeForSTL.includes(time)) {
            return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeForSTL.join(', ')}` }));
        }
        if (type === '3D' && !validTimeFor3D.includes(time)) {
            return res.status(403).json(Object.assign(Object.assign({}, api_statuses_const_1.statuses['0310']), { data: `Time ${validTimeFor3D.join(', ')}` }));
        }
        if (isRambled) {
            if (!allowedInRamble(number)) {
                return res.status(403).json(api_statuses_const_1.statuses['0315']);
            }
        }
        return res.status(200).json(api_statuses_const_1.statuses['0300']);
    }
    catch (error) {
        console.log('@checkNumberAvailability error', error);
        res.status(500).json(api_statuses_const_2.statuses['0900']);
    }
});
exports.checkNumberAvailability = checkNumberAvailability;
const winCount = (dailyResults, bets) => {
    const winCounts = [];
    dailyResults.forEach((dailyResult) => {
        const { number, type, time, schedule } = dailyResult;
        const matchedItems = bets.filter((bet) => {
            return bet.type === type &&
                bet.time === time &&
                bet.schedule === schedule.toISOString().substring(0, 10) &&
                (bet.rambled ? areEquivalentNumbers(bet.number, number) : bet.number === number);
        });
        const wins = matchedItems.length;
        winCounts.push({ number, wins, time, type, schedule });
    });
    return winCounts;
};
const areEquivalentNumbers = (num1, num2) => {
    if (num1.length !== num2.length) {
        return false;
    }
    const sortedNum1 = num1.split('').sort().join('');
    const sortedNum2 = num2.split('').sort().join('');
    return sortedNum1 === sortedNum2;
};
const isSoldOutNumber = (number, schedule, time, ramble) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            {
                $match: {
                    time,
                    number,
                    $expr: {
                        $eq: [
                            { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                            new Date(schedule).toISOString().substring(0, 10)
                        ]
                    }
                }
            }
        ];
        const result = yield bet_model_1.NumberStats.aggregate(pipeline);
        const total = (0, exports.getNumbersTotalAmount)(result);
        const limit = getNumberAndLimitClassification(number, ramble).limit;
        return { full: total >= limit, limit, total };
    }
    catch (error) {
        console.log('@isSoldOut error', error);
    }
});
const allowedInRamble = (combination) => {
    return !(combination[0] === combination[1] && combination[1] === combination[2]);
};
const breakRambleNumbers = (input) => {
    const result = new Set();
    const permute = (str, prefix = '') => {
        if (str.length === 0) {
            result.add(prefix);
            return;
        }
        for (let i = 0; i < str.length; i++) {
            permute(str.slice(0, i) + str.slice(i + 1), prefix + str[i]);
        }
    };
    permute(input);
    return Array.from(result);
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
    if (ramble) {
        return {
            class: 'ramble',
            limit: Number(process.env.BET_RAMBLE_NUM_LIMIT)
        };
    }
    const digits = number.split('').map(Number);
    const uniqueDigits = new Set(digits);
    const isDouble = digits.length === 3 && uniqueDigits.size === 2;
    const isTriple = uniqueDigits.size === 1;
    if (isDouble) {
        return { class: 'double', limit: Number(process.env.BET_DOUBLE_NUM_LIMIT) };
    }
    else if (isTriple) {
        return { class: 'triple', limit: Number(process.env.BET_TRIPLE_NUM_LIMIT) };
    }
    else {
        return { class: 'normal', limit: Number(process.env.BET_NORMAL_NUM_LIMIT) };
    }
};
//# sourceMappingURL=bet.controller.js.map