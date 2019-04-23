const Joi = require('joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send({
            error: {
                message: 'Email not valid'
            }
        });
    if (!user.isActive) {
        return res.status(400).send({
            error: {
                message:
                    'User status not active. Please contact your administrator'
            }
        });
    }

    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword)
        return res.status(400).send({
            error: {
                message: 'Password not valid'
            }
        });
    const token = user.generateAuthToken();
    const result = {
        message: 'Login success',
        token: token
    };
    res.send(result);
});

const validate = user => {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(50)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(30)
            .required()
    };
    return Joi.validate(user, schema);
};

module.exports = router;
