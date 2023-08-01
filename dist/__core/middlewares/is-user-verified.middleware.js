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
exports.isUserVerified = void 0;
const isUserVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const profile = await Profile.findOne({ user: req.user }).exec()
    // console.log(profile)
    // next();
});
exports.isUserVerified = isUserVerified;
//# sourceMappingURL=is-user-verified.middleware.js.map