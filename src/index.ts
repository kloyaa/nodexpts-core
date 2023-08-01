import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from '../__core/utils/db.util';

import authRoute from './routes/auth.route';
import profileRoute from './routes/profile.route';
import betRoute from './routes/bet.route';
import employeeRoute from './routes/employee.route';

const app: Application = express();
const envVars = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    DB_CONNECTION_STRING_LOCAL: process.env.DB_CONNECTION_STRING_LOCAL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SECRET_NAME: process.env.AWS_SECRET_NAME,
    BET_DOUBLE_NUM_LIMIT: process.env.BET_DOUBLE_NUM_LIMIT,
    BET_TRIPLE_NUM_LIMIT: process.env.BET_TRIPLE_NUM_LIMIT,
    BET_NORMAL_NUM_LIMIT: process.env.BET_NORMAL_NUM_LIMIT,
    BET_RAMBLE_NUM_LIMIT: process.env.BET_RAMBLE_NUM_LIMIT,
};

// Middleware
app.use(helmet()); // Apply standard security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api', authRoute);
app.use('/api', profileRoute);
app.use('/api', betRoute);
app.use('/api', employeeRoute);
app.get('/', (_, res) => res.send('Express Typescript on Vercel'));

// Connect to MongoDB
connectDB();

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
    console.log('Environment Variables:', envVars);
});

export default app;
