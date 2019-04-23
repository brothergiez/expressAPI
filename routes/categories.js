const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { Category, validate } = require('../models/category');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.query.page || req.query.page <= 0) req.query.page = 1;
    const totalFeed = await Category.countDocuments();
    const limit = 5;
    const page = limit * (req.query.page - 1);
    const categories = await Category.find()
        .limit(limit)
        .skip(page)
        .sort('name')
        .select('-__v');

    const result = {
        page: req.query.page,
        totalPage: Math.ceil(totalFeed / limit),
        perPage: limit,
        dataCount: categories.length,
        totalData: totalFeed,
        data: categories.map(doc => {
            return {
                _id: doc._id,
                name: doc.name
            };
        })
    };
    res.send(result);
});

router.post('/', [auth, role], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let category = await Category.findOne({ name: req.body.name });
    if (category)
        return res.status(400).send({
            error: {
                message: 'Category already registered'
            }
        });

    category = new Category({ name: req.body.name });

    await category.save();
    res.send(_.pick(category, ['_id', 'name']));
});

router.put('/:id', [auth, role], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name
            },
            { new: true }
        );

        if (!category)
            return res.status(400).send({
                error: {
                    message: 'The category with the given ID was not found'
                }
            });
        res.send(_.pick(category, ['_id', 'name']));
    } else {
        return res.status(400).send({
            error: {
                message: 'The category with the given ID was not found'
            }
        });
    }
});

router.delete('/:id', [auth, role], async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category)
            return res.status(400).send({
                error: {
                    message: 'The category with the given ID was not found'
                }
            });
        res.send(_.pick(category, ['_id', '_name']));
    } else {
        return res.status(400).send({
            error: {
                message: 'The category with the given ID was not found'
            }
        });
    }
});

module.exports = router;
