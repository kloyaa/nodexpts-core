"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsSecrets = void 0;
require('dotenv').config();
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const methods_util_1 = require("../utils/methods.util");
const getAwsSecrets = async () => {
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
        const data = await client.send(new client_secrets_manager_1.GetSecretValueCommand({
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
};
exports.getAwsSecrets = getAwsSecrets;
