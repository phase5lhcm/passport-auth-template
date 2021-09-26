import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default function passportConfig(passport) {
    // email is the usernameField
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({ email: email });
        // 1 if no matching user exists with matching email
        if (!user) {
            return done(null, false, {
                message: 'No user with found with that email address',
            });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Incorrect password, try again',
                });
            }
        } catch (e) {
            return done(e);
        }
    };
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, authenticateUser)
    );
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, function (err, user) {
            if (err) return done(err);
            done(null, user);
        });
    });
}
