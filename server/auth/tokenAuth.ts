require('dotenv').config({
    path: __dirname + '/./../.env'
})
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const secret = config.secret;
import { IUserEmail } from '../interfaces/IUserEmail';

const generateToken = (data: IUserEmail) => {
    const token = jwt.sign(data, secret, { expiresIn: '1h' });

    return token;
}

const verifyToken = (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            const token = req.headers.authorization.split(' ')[1];
            const { userEmail } = jwt.verify(token, secret);

            if (userEmail) {
                req.body.userEmail = userEmail;
                next();
            } else {
                return res.status(403).json("No email specified in token.")
            }
        } else {
            return res.status(403).json("No token specified.");
        }
    } catch (error) {
        console.log(`Error with decoding of token with an error: ${error}!`);
        return res.status(403).json({ error });
    }

}

export = {
    generateToken,
    verifyToken
}

console.log(generateToken({ userEmail: 'pesjak.matej@gmail.com' }))