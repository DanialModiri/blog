'use strict'

require('express-async-errors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const expressLayout = require('express-ejs-layouts');
const articles = require('./routes/articles')
const mongoose = require('mongoose');
const { mongoose_validator, last_validator } = require('./routes/middlewares/errormiddleware')
const admin = require('./routes/admin')
const cookiesParser = require('cookie-parser')
const { adminAuth } = require('./routes/middlewares/adminmiddleware')
const category = require('./routes/categories')

mongoose.connect('mongodb://localhost:27017/blog')

app.use(express.static('./public'));
app.use(cookiesParser())
app.use(bodyParser.json());
app.use(expressLayout);
app.use('/admin_public', adminAuth, express.static('./admin_scripts'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.locals.user = {
        avatar: 'http://www.anupambharatonline.com/photonews/1557856456.jpg',
        username: 'Danial Modiri'
    }
    res.render('profile');
})
app.use('/articles', articles);
app.use('/admin', admin);
app.use('/categories', category);
app.use(mongoose_validator);
app.use(last_validator);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on ${port}`);
});