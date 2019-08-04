const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment')
const { addAuthPayload } = require('./middlewares/user')
require('../models/User')

router.get('/:article', async (req, res) => {
    const comments = await Comment.find({ article: req.params.article }).populate('user').exec();
    res.send(comments);
})

router.get("/user/:user", async (req, res) => {
    const comments = await Comment.find({ user: req.params.user }).populate('user', ['username', 'avatar']).populate('article', ['title']);
    res.send({ comments });
})

router.post('/:article', addAuthPayload, async (req, res) => {
    const newComment = new Comment({
        ...req.body,
        user: req.user._id,
        article: req.params.article
    });
    await newComment.save();
    res.send(newComment);
})

module.exports = router;