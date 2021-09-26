import express from 'express';
import { userRegister } from '../controllers/UserAuthController.js';
import {
    checkAuthenticatedUser,
    checkNotAuthenticated,
} from '../middleware/userAuthCheck.js';
import passport from 'passport';

const router = express.Router();

/**
 * @method - GET
 * @param - /
 * @description - Home page
 */
router.get('/', checkAuthenticatedUser, (req, res) => {
    res.send('Home page');
});
/**
 * @method - GET
 * @param - /login
 * @description - login page
 */
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.send('Login Page');
});
/**
 * @method - GET
 * @param - /register
 * @description - register page
 */
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.send('Register Page');
});

/**
 * @method - POST
 * @param - /register
 * @description - user sign up
 */
router.post(
    '/register',
    checkNotAuthenticated,
    userRegister,
    async (req, res) => {}
);
/**
 * @method - POST
 * @param - /login
 * @description - user login
 */

//TODO - add error handling
router.post('/login', passport.authenticate('local'), function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.send('Success');
});
/**
 * @method - DELETE // change to post?
 * @param - /
 * @description - user logout
 */
router.delete('/logout', (req, res) => {
    // logOut provided by passport
    req.logOut();
    res.redirect('/login');
});

export default router;
