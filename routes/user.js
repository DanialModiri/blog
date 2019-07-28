const express = require('express');
const router = express.Router();
const { addAuthPayload, authMiddleware } = require('./middlewares/user')
const Comment = require('../models/Comment')
const User = require('../models/User')

router.get('/', addAuthPayload, (req, res) => {
    return req.user;
})

router.post('/comment/:article', authMiddleware, async (req, res) => {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.send(newComment);
})

router.post('/addToFavs/:article', addAuthPayload, async (req, res) => {
    await req.user.addToFavs(req.params.id);
    res.send('با موفقیت ثبت شد');
})

router.put('/editFavs', authMiddleware, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, { favoritesArticles: req.body.favoritesArticles }, { new: true, runValidators: true });
    res.send(user);
});

module.exports = router;