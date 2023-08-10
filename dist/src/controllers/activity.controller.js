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
exports.getAllActivityLogs = void 0;
const api_statuses_const_1 = require("../../__core/const/api-statuses.const");
const activity_model_1 = require("../../__core/models/activity.model");
const getAllActivityLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
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
        ];
        // Execute the aggregation pipeline
        const result = yield activity_model_1.Activity.aggregate(pipeline).sort({ createdAt: -1 });
        if (result.length === 0) {
            res.status(200).json([]);
            return;
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.log('@getAllActivityLogs error', error);
        res.status(500).json(api_statuses_const_1.statuses['0900']);
    }
});
exports.getAllActivityLogs = getAllActivityLogs;
//# sourceMappingURL=activity.controller.js.map