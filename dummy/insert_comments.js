const mongoose = require('mongoose');

const Comment = require('../models/Comment')
const fs = require('fs')

const comments_part_1 = fs.readFileSync('./dummy/COMMENTS_DATA_PART_1.json');
const comments_part_2 = f.readFileSync('./dummy/COMMENTS_DATA_PART_2');
const comments = fs.readFileSync('./dummy/COMMENTS_DATA_PART_3.JSON');

mongoose.connect('mongodb://localhost:27017/blog', async (err) => {
    await Comment.remove({});
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

