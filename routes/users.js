const auth = require('../middleware/auth');
const role = require('../middleware/role');
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

const router = express.Router();

//GET CURRENT USER BASED ON TOKEN
//requirement token
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    res.send(user);
});

//UPDATE/EDIT CURRENT USER BASED ON TOKEN
//requirement token
router.put('/me', auth, role, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({
            error: {
                message: 'User already registered'
            }
        });

    if (mongoose.Types.ObjectId.isValid(req.user._id)) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        user = await User.findByIdAndUpdate(
            req.user._id,
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: password
            },
            {
                new: true
            }
        ).select('-password, -__v');
        if (!user)
            return res.status(400).send({
                error: {
                    message: 'The user with the given ID was not found'
                }
            });
        res.send(user);
    } else {
        return res.status(400).send({
            error: {
                message: 'The user with the given ID was not found'
            }
        });
    }
});

//GET USER LISTS
//requirement token and isAdmin=true
router.get('/', [auth, role], async (req, res) => {
    if (!req.query.page || req.query.page <= 0) req.query.page = 1;
    const totalFeed = await User.countDocuments();
    const limit = 20;
    const page = limit * (req.query.page - 1);
    const users = await User.find()
        .limit(limit)
        .skip(page)
        .select('-password  -__v');

    const result = {
        page: req.query.page,
        totalPage: Math.ceil(totalFeed / limit),
        perPage: limit,
        dataCount: users.length,
        totalData: totalFeed,
        data: users.map(user => {
            return {
                _id: user._id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            };
        })
    };
    res.send(result);
});

//ADD NEW USER
//requirement token and isAdmin=true
router.post('/', [auth, role], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({
            error: {
                message: 'User already registered'
            }
        });

    user = new User(
        _.pick(req.body, [
            'first_name',
            'last_name',
            'email',
            'password',
            'isAdmin',
            'isActive'
        ])
    );

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(
        _.pick(user, [
            '_id',
            'first_name',
            'last_name',
            'email',
            'isAdmin',
            'isActive'
        ])
    );
});

//GET USER BY ID
//requirement token and isAdmin=true
router.get('/:id', [auth, role], async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findById(req.params.id).select(
            '-password -__v'
        );
        if (!user)
            return res.status(400).send({
                error: {
                    message: 'The user with the given ID was not found'
                }
            });
        res.send(user);
    } else {
        return res.status(400).send({
            error: {
                message: 'The user with the given ID was not found'
            }
        });
    }
});

//UPDATE/EDIT USER BY ID
//requirement token and isAdmin=true
router.put('/:id', [auth, role], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: password
            },
            {
                new: true
            }
        ).select('-password');
        if (!user)
            return res.status(400).send({
                error: {
                    message: 'The user with the given ID was not found'
                }
            });
        res.send(user);
    } else {
        return res.status(400).send({
            error: {
                message: 'The user with the given ID was not found'
            }
        });
    }
});

//DELETE USER
//requirement token and isAdmin=true
router.delete('/:id', [auth, role], async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const user = await User.findByIdAndDelete(req.params.id).select(
            '-password -__v'
        );
        if (!user)
            return res.status(400).send({
                error: {
                    message: 'The user with the given ID was not found'
                }
            });
        res.send(user);
    } else {
        return res.status(400).send({
            error: {
                message: 'The user with the given ID was not found'
            }
        });
    }
});

module.exports = router;
