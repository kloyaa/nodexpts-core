"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtExpiry = void 0;
var JwtExpiry;
(function (JwtExpiry) {
    JwtExpiry[JwtExpiry["ONE_MINUTE"] = 60] = "ONE_MINUTE";
    JwtExpiry[JwtExpiry["FIVE_MINUTES"] = 300] = "FIVE_MINUTES";
    JwtExpiry[JwtExpiry["TEN_MINUTES"] = 600] = "TEN_MINUTES";
    JwtExpiry[JwtExpiry["FIFTEEN_MINUTES"] = 900] = "FIFTEEN_MINUTES";
    JwtExpiry[JwtExpiry["THIRTY_MINUTES"] = 1800] = "THIRTY_MINUTES";
    JwtExpiry[JwtExpiry["ONE_HOUR"] = 3600] = "ONE_HOUR";
    JwtExpiry[JwtExpiry["TWO_HOURS"] = 7200] = "TWO_HOURS";
    JwtExpiry[JwtExpiry["FOUR_HOURS"] = 14400] = "FOUR_HOURS";
    JwtExpiry[JwtExpiry["EIGHT_HOURS"] = 28800] = "EIGHT_HOURS";
    JwtExpiry[JwtExpiry["ONE_DAY"] = 86400] = "ONE_DAY";
    JwtExpiry[JwtExpiry["ONE_WEEK"] = 604800] = "ONE_WEEK";
    JwtExpiry[JwtExpiry["ONE_MONTH"] = 2592000] = "ONE_MONTH";
    JwtExpiry[JwtExpiry["CUSTOM"] = -1] = "CUSTOM";
})(JwtExpiry || (exports.JwtExpiry = JwtExpiry = {}));
//# sourceMappingURL=jwt.enum.js.map