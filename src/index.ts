import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from '../__core/utils/db.util';

import authRoute from './routes/auth.route';
import profileRoute from './routes/profile.route';
import betRoute from './routes/bet.route';
import employeeRoute from './routes/employee.route';

const app: Application = express();

// Middleware
app.use(helmet()); // Apply standard security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/api', authRoute);
app.use('/api', profileRoute);
app.use('/api', betRoute);
app.use('/api', employeeRoute);

// Connect to MongoDB
connectDB();

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

export default app;
