import mongoose from 'mongoose';
export default async function connectDb() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('DB Connected'));

    mongoose.connection.on('error', (err) => {
        console.log(`DB connection error: ${err.message}`);
    });
}

// export default async function connectDb() {
//     const client = new MongoClient(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
//     client.connect((err) => {
//         const collection = client.db('user').collection('accounts');
//         console.log('Success');
//         // perform actions on the collection object
//         client.close();
//     });
// }
