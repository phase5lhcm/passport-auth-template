import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDb from './models/mongoConfig.js';
import passportConfig from './passport/setup.js';
import dotenv from 'dotenv';
import passport from 'passport';
import userRoutes from './routes/userAuthRoutes.js';
// import mongoose from 'mongoose';
// import pkg from 'mongoose';
// const { Mongoose } = pkg;

// const MongoStore = new connectMongo(session);
dotenv.config();
passportConfig();
const app = express();
const PORT = process.env.PORT || 3000;

connectDb();
app.use(express.urlencoded({ extended: false }));

//  body-parser middleware reads the payloads of post and put requests
app.use(express.json());

//Express session middleware
// uses existing Mongo connection to store the session data.
app.use(
    session({
        secret: 'addSecretKeyHere',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send('You are here'));
app.use('/user', userRoutes, (req,res));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
