const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');

async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token)
        return res.status(403).send({
            error: {
                message: 'Access denied. No token provided!'
            }
        });

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        const users = await User.findById(req.user._id);
        if (!users)
            return res.status(403).send({
                error: {
                    message: 'Access denied. User not found!'
                }
            });
        if (!users.isActive)
            return res.status(403).send({
                error: {
                    message: 'Access denied. User status not active!'
                }
            });
        next();
    } catch (ex) {
        return res.status(403).send({
            error: {
                message: 'Access denied. Token invalid!'
            }
        });
    }
}

module.exports = auth;
