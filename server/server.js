import express from 'express';
import session from 'express-session';
// import MongoStore from 'connect-mongo';
import connectDb from './models/mongoConfig.js';
import dotenv from 'dotenv';
import passportConfig from './passport/passportInitialize.js';
import passport from 'passport';
//import flash from 'express-flash';
import userAuthRoutes from './routes/userRoutes.js';
import User from './models/User.js';

dotenv.config();

passportConfig(
    passport
    // (email) => User.find((email) => User.email === email),
    // (id) => User.find((User) => User.id === id)
);

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();
// allows us to access form data thru matching name fields
app.use(express.urlencoded({ extended: false }));

//  body-parser middleware reads the payloads of post and put requests
app.use(express.json());
//app.use(flash());

//Express session middleware
// uses existing Mongo connection to store the session data.
app.use(
    session({
        secret: 'addSecretKeyHere',
        resave: false,
        saveUninitialized: false,
        // store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Test Routes
// app.get('/', (req, res) => res.send('You are here'));
// app.use('/user', userRoutes);
app.use('/api/v1/user', userAuthRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
