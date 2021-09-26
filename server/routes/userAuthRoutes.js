import express from 'express';
import passport from 'passport';

const router = express.Router();

/**
 * This route handles both register and user login by
 * invoking the local strategy.
 * if no error && a matcing user is found => user is logged in
 */
router.post('/register', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return res
                .status(400)
                .json({ message: `Unable to find account: ${err}` });
        }
        if (!user) {
            return res.status(400).json({ message: `User not found: ${err}` });
        }
        return res.status(200).json({ success: `Logged in as ${user.id}` });
    });
    next();
});

export default router;
