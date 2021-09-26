import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function userRegister(req, res, next) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        return res.json({
            message: 'Account created',
            user: newUser,
        });
    } catch (e) {
        console.log('User register error: ', e);
        return res.json({
            message: 'Registration error',
            error: e.Message,
        });
        next();
    }
}
