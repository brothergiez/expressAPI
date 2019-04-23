const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { Post, validate } = require('../models/post');
const { User } = require('../models/user');
const { Category } = require('../models/category');
const slugify = require('slugify');
const _ = require('lodash');
const moment = require('moment');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.query.page || req.query.page <= 0) req.query.page = 1;
    const totalFeed = await Post.countDocuments();
    const limit = 20;
    const page = limit * (req.query.page - 1);
    const post = await Post.find()
        .limit(limit)
        .skip(page)
        .sort('_id')
        .select(['id', 'title', 'slug', 'publishDate']);
    if (!post.length)
        return res.status(400).send({
            error: {
                message: 'No article found'
            }
        });
    const result = {
        page: req.query.page,
        totalPage: Math.ceil(totalFeed / limit),
        perPage: limit,
        dataCount: post.length,
        totalData: totalFeed,
        data: post.map(doc => {
            return {
                _id: doc._id,
                title: doc.title,
                slug: doc.slug,
                publishedAt: moment(doc.publishDate).format(
                    'YYYY-MM-DD hh:mm:ss'
                ),
                detail: {
                    method: 'GET',
                    url: 'http://localhost:5000/api/posts/' + doc.slug
                }
            };
        })
    };
    res.send(result);
});

router.post('/', [auth, role], async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message
            }
        });

    const urlSlug = slugify(req.body.slug ? req.body.slug : req.body.title);
    const slug = await Post.findOne({ slug: urlSlug });
    if (slug)
        return res.status(400).send({
            error: {
                message: 'Slug already exist'
            }
        });

    const author = await User.findById(req.body.authorId);
    if (!author)
        return res.status(400).send({
            error: {
                message: 'Invalid author ID'
            }
        });

    const category = await Category.findById(req.body.categoryId);
    if (!category)
        return res.status(400).send({
            error: {
                message: 'Invalid category ID'
            }
        });

    const post = new Post({
        title: req.body.title,
        slug: urlSlug,
        author: {
            _id: author._id,
            first_name: author.first_name,
            last_name: author.last_name
        },
        category: {
            _id: category._id,
            name: category.name
        },
        content: req.body.content,
        createDate: req.body.createDate
    });

    await post.save();
    res.send({
        message: 'success',
        data: _.pick(post, [
            '_id',
            'title',
            'slug',
            'author',
            'category',
            'createDate',
            'publishDate'
        ])
    });
});

router.get('/:slug', async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).select('-__v');
    if (!post)
        return res.status(400).send({
            error: {
                message: 'Articles not found or has been deleted'
            }
        });
    res.send(post);
});

module.exports = router;
