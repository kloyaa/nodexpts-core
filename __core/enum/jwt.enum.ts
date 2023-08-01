export enum JwtExpiry {
    ONE_MINUTE = 60, // 1 minute in seconds
    FIVE_MINUTES = 300, // 5 minutes in seconds
    TEN_MINUTES = 600, // 10 minutes in seconds
    FIFTEEN_MINUTES = 900, // 15 minutes in seconds
    THIRTY_MINUTES = 1800, // 30 minutes in seconds
    ONE_HOUR = 3600, // 1 hour in seconds
    TWO_HOURS = 7200, // 2 hours in seconds
    FOUR_HOURS = 14400, // 4 hours in seconds
    EIGHT_HOURS = 28800, // 8 hours in seconds
    ONE_DAY = 86400, // 1 day in seconds
    ONE_WEEK = 604800, // 1 week in seconds
    ONE_MONTH = 2592000, // 1 month in seconds
    CUSTOM = -1, // You can use this to represent a custom expiry duration
}