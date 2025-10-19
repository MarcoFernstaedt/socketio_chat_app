import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;