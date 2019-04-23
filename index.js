const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const auth = require('./routes/auth');
const categories = require('./routes/categories');
const posts = require('./routes/posts');
const app = express();
mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/categories', categories);
app.use('/api/posts', posts);

app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send({ error: { message: error.message } });
});

if (!config.get('jwtPrivateKey')) {
    console.log('Fatal error. jwtPrivateKey is not defined!');
    process.exit(1);
}

mongoose
    .connect('mongodb://localhost/cms', {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('Mongodb Connected'))
    .catch(err => console.log("Can't connect to database"));

app.get('/', (req, res) => {
    res.send('hallo');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server starting at port ${port}`));
