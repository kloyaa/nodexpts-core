import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/db_swertesaya';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
