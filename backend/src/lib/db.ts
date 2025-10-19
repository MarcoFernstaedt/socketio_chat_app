import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const { MONGO_URI } = process.env
        if (!MONGO_URI) throw new Error('MONGO_URI is not set')
        const conn = await mongoose.connect(MONGO_URI as string);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;