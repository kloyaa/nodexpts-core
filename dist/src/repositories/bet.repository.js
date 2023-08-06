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
exports.getBetResultRepository = exports.getMyBetsRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bet_model_1 = require("../models/bet.model");
const bet_result_model_1 = require("../models/bet-result.model");
const getMyBetsRepository = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { time, type, schedule, user } = query;
        const pipeline = [];
        if (time || type || schedule) {
            const formattedSchedule = schedule
                ? new Date(schedule).toISOString().substring(0, 10)
                : new Date().toISOString().substring(0, 10);
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
            pipeline.push({
                $match: Object.assign(Object.assign({}, matchStage), { user: new mongoose_1.default.Types.ObjectId(user) }),
            });
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
                number: 1,
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
                reference: 1,
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
        const result = yield bet_model_1.Bet.aggregate(pipeline);
        if (result.length === 0) {
            return [];
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
        return mergedData;
    }
    catch (error) {
        console.log('@getAll error', error);
        throw error;
    }
});
exports.getMyBetsRepository = getMyBetsRepository;
const getBetResultRepository = (schedule) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedSchedule = schedule
        ? new Date(schedule).toISOString().substring(0, 10)
        : new Date().toISOString().substring(0, 10);
    console.log(formattedSchedule);
    const aggregationPipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $dateToString: { format: '%Y-%m-%d', date: '$schedule', timezone: 'UTC' } },
                        formattedSchedule,
                    ],
                },
            },
        },
        {
            $project: {
                _id: 0,
                schedule: 1,
                number: 1,
                time: 1,
                type: 1,
            },
        },
    ];
    const result = yield bet_result_model_1.BetResult.aggregate(aggregationPipeline);
    return result;
});
exports.getBetResultRepository = getBetResultRepository;
//# sourceMappingURL=bet.repository.js.map