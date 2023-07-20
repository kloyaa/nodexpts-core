require('dotenv').config();
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { AwsSecretsResult } from '../interfaces/aws-s3.interface';
import { isEmpty } from '../utils/methods.util';

export const getAwsSecrets = async (): Promise<AwsSecretsResult | null> => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
    const secret_name = process.env.AWS_SECRET_NAME as string;

    if(isEmpty(accessKeyId) || isEmpty(secretAccessKey) || isEmpty(secret_name)) {
        return null;
    }
    
    const client = new SecretsManagerClient({
        region: 'ap-southeast-1',
        credentials: { accessKeyId, secretAccessKey },
    });

    try {
        const data = await client.send(new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: 'AWSCURRENT',
        }));

        if ('SecretString' in data && data.SecretString !== undefined) {
            const parsedData = JSON.parse(data.SecretString);
            return parsedData;
        }
        return null;
    } catch (error) {
        console.log('@getAwsSecrets error', error)
        return null;
    }
};