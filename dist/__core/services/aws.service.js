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
exports.getAwsSecrets = void 0;
require('dotenv').config();
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const methods_util_1 = require("../utils/methods.util");
const getAwsSecrets = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const secret_name = process.env.AWS_SECRET_NAME;
    if ((0, methods_util_1.isEmpty)(accessKeyId) || (0, methods_util_1.isEmpty)(secretAccessKey) || (0, methods_util_1.isEmpty)(secret_name)) {
        return null;
    }
    const client = new client_secrets_manager_1.SecretsManagerClient({
        region: 'ap-southeast-1',
        credentials: { accessKeyId, secretAccessKey },
    });
    try {
        const data = yield client.send(new client_secrets_manager_1.GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: 'AWSCURRENT',
        }));
        if ('SecretString' in data && data.SecretString !== undefined) {
            const parsedData = JSON.parse(data.SecretString);
            return parsedData;
        }
        return null;
    }
    catch (error) {
        console.log('@getAwsSecrets error', error);
        return null;
    }
});
exports.getAwsSecrets = getAwsSecrets;
//# sourceMappingURL=aws.service.js.map