export enum EventName  {
    LOGIN = 'login-activity',
    ACCOUNT_CREATION = 'register-activity',
    LOGOUT = 'logout-activity',
    ROLE_CREATION = 'role-creation-activity',
    PROFILE_CREATION = 'profile-creation-activity',
}

export enum ActivityType {
    ROLE_CREATION = 'Role created',
    PROFILE_CREATION = 'Profile created',
    LOGIN = 'Login',
    LOGIN_FAILURE = 'Login failed',
    LOGOUT = 'Logout',
    ACCOUNT_CREATION = 'Account created',
    WITHDRAWAL_CREATION = 'WITHDRAWAL_CREATION',
    DEPOSIT_CREATION = 'DEPOSIT_CREATION',
    ORDER_PLACEMENT = 'ORDER_PLACEMENT',
    ORDER_CANCELLATION = 'ORDER_CANCELLATION',
    ACCOUNT_WALLET_CHANGES = 'ACCOUNT_WALLET_CHANGES',
    ACCOUNT_SETTING_CHANGES = 'ACCOUNT_SETTING_CHANGES',
    ACCOUNT_PROFILE_CHANGES = 'ACCOUNT_PROFILE_CHANGES',
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    API_REQUEST = 'API_REQUEST',
    SECURITY_EVENT = 'SECURITY_EVENT',
    ADMIN_ACTION = 'ADMIN_ACTION',
    EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION',
    SMS_NOTIFICATTION = 'SMS_NOTIFICATTION',
}