require('dotenv').config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.ENVIRONMENT === "development" 
  ? process.env.DB_CONNECTION_STRING_LOCAL as string
  : process.env.DB_CONNECTION_STRING as string;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connection success');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};

export default connectDB;
