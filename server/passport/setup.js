import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
/**
 * We will instead use email instead of username to
 * identify if user already exists in db
 *
 * If we can’t find a user, a new user is created with the encrypted password.
 * If a user is found, the encrypted provided password is compared against the encrypted password in the database
 */

// serializeUser() takes a user id and stores it internally on req.session.passport
//  which is Passport’s internal mechanism to keep track of things.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserializeUser() uses the id to retrieve the data and
// return an object with data.

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local strategy using Bcryptjs to hash password
/**
 * done() takes in         
 * An error or null if no error found
   A user or false if no user found
 */
export default function passportConfig() {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                // Match User
                User.findOne({ email: email })
                    .then((user) => {
                        // Create a new user if a user with matcing email is not found in db
                        if (!user) {
                            const newUser = new User({ email, password });
                            // hash password before storing it in database
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(
                                    newUser.password,
                                    salt,
                                    (err, hash) => {
                                        if (err) throw err;
                                        newUser.password = hash;
                                        newUser
                                            .save()
                                            .then((user) => {
                                                return done(null, user);
                                            })
                                            .catch((err) => {
                                                return done(null, false, {
                                                    message: `Error creating new account ${err}`,
                                                });
                                            });
                                    }
                                );
                            });
                            // Return user account if a matching email address is found
                        } else {
                            // Match password
                            bcrypt.compare(
                                password,
                                user.password,
                                (err, isMatch) => {
                                    if (err) throw err;
                                    if (isMatch) return done(null, user);
                                    else
                                        return done(null, false, {
                                            message: 'Wrong password',
                                        });
                                }
                            );
                        }
                    })
                    .catch((err) => {
                        return done(null, false, {
                            message: `Error finding User: ${err}`,
                        });
                    });
            }
        )
    );
}
