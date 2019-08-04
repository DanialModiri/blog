const mongoose = require('mongoose');

const Article = require('../models/Article')
const fs = require('fs')
const path = require('path')

mongoose.connect('mongodb://localhost:27017/blog', async (err) => {
    if (err)
        return console.log(err);
    let articles = await Article.find().exec();
    console.log(articles)
    articles = articles.map(item => item._id)
    fs.writeFileSync(path.resolve(__dirname, './ARTICLE_IDS.txt'), articles.join(', '));
    mongoose.disconnect();
})

