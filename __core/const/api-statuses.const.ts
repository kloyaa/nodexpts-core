const statuses = {
    /**
     * @alias Profile
     * @description from 00 - 100
     */ 
    "00": {
        message: "success",
        code: 200,
    },
    "01": {
        message: "error",
        code: 400,
    },
    "02": {
        message: "not found",
        code: 400,
    },

    /**
     * @alias Authentication
     * @description from 0050 - 0100
     */ 
    "0050": {
        message: "Incorrect username and/or password.",
        code: 400
    },
    "0051": {
        message: "Account already registered.",
        code: 400
    },
    "0052": {
        message: "Account suspended.",
        code: 403,
    },
    "0053": {
        message: "Account blocked.",
        code: 403,
    },
    /**
     * @alias Profile
     * @description from 0100 - 0200
     */ 
    "0100": {
        message: "Profile updated successfully.",
        code: 400
    },
    "0101": {
        message: "Profile created successfully.",
        code: 400
    },
    "0102": {
        message: "Profile deleted.",
        code: 400
    },
    "0103": {
        message: "Profile not found.",
        code: 400
    }
}