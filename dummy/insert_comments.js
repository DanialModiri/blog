const mongoose = require('mongoose');

const Comment = require('../models/Comment')
const fs = require('fs')

const comments = fs.readFileSync('./dummy/COMMENTS_DATA.JSON');

mongoose.connect('mongodb://localhost:27017/blog', async (err) => {
    //await Comment.remove({});
    console.log(JSON.parse(comments).length)
    if (err)
        return console.log(err);
    Comment.create(JSON.parse(comments)).then(res => {
        console.log('DONE!')
        mongoose.disconnect();
    }).catch(err => {
        console.log(err);
        mongoose.disconnect();
    })
})

