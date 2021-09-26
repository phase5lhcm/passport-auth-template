import mongoose from 'mongoose';

export default async function connectDb() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('DB Connected'));

    mongoose.connection.on('error', (err) => {
        console.log(`DB connection error: ${err.message}`);
    });
}
