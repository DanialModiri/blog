const mongoose = require('mongoose')
const Article = require('../models/Article')
const fs = require('fs')
const path = require('path')



async function insertArticles(){
    try{
        await mongoose.connect('mongodb://localhost:27017/blog')
        let articles = JSON.parse(fs.readFileSync(path.resolve(__dirname, './ARTICLES_DATA.JSON')));
        articles = articles.map(item => {
            return { ...item, images: item.images.map(img => img.url) }
        })
        await Article.remove({});
        await Article.create(articles);
        await mongoose.disconnect();
        console.log('DONE!')
    }catch(err){
        await mongoose.disconnect();
    }

}


insertArticles();