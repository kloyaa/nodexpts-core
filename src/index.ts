import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import exampleRoute from './routes/example.route';
import connectDB from '../__core/utils/db.util';

const app: Application = express();

// Middleware
app.use(helmet()); // Apply standard security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use('/example', exampleRoute);

// Connect to MongoDB
connectDB();

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

export default app;
