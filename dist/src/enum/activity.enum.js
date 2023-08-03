"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetActivityType = exports.BetEventName = void 0;
var BetEventName;
(function (BetEventName) {
    BetEventName["PLACE_BET"] = "place-bet-activity";
    BetEventName["CREATE_BET_RESULT"] = "create-bet-result-activity";
    BetEventName["BET_ACTIVITY"] = "bet-activity";
})(BetEventName || (exports.BetEventName = BetEventName = {}));
var BetActivityType;
(function (BetActivityType) {
    BetActivityType["PLACE_BET"] = "Bet placed";
    BetActivityType["CREATE_BET_RESULT"] = "Submitted a daily bet result";
    BetActivityType["DELETED_BET_RESULT"] = "Deleted a daily bet result";
})(BetActivityType || (exports.BetActivityType = BetActivityType = {}));
//# sourceMappingURL=activity.enum.js.map