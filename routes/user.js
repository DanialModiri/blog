const express = require('express');
const router = express.Router();
const { addAuthPayload, authMiddleware, shouldNotAuthenicated } = require('./middlewares/user')
const Comment = require('../models/Comment')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { jwtKeyForUsers } = require("../config")
const _ = require('lodash')

router.get('/profile', addAuthPayload, async (req, res) => {
    res.send(req.user);
});

router.post('/signin', shouldNotAuthenicated, async (req, res) => {
    if (!req.body.username || !req.body.password)
        return res.status(400).send('نام کاربری و رمز عبور مورد نیاز است');
    const user = await User.findOne({ username: req.body.username })
    if (!user)
        return res.status(401).send('نام کاربری یا رمز عبور اشتباه می‌باشد');
    if (!bcrypt.compareSync(req.body.password, user.password))
        return res.status(401).send('نام کاربری یا رمز عبور اشتباه می‌باشد');

    const token = jwt.sign(_.pick(user, ['first_name', 'last_name', 'username', 'date', '_id']), jwtKeyForUsers);
    res.cookie('token', token);
    delete user._doc.password;
    res.send({ user, token });
})

router.get('/logout', authMiddleware, (req, res) => {
    res.clearCookie('token');
    res.send('با موفقیت خارج شدید');
})

router.post('/signup', shouldNotAuthenicated, async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    delete newUser._doc.password;
    res.send(newUser);
})

router.get('/', addAuthPayload, (req, res) => {
    return req.user;
})

router.post('/comment/:article', authMiddleware, async (req, res) => {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.send(newComment);
})

router.post('/addToFavs/:article', addAuthPayload, async (req, res) => {
    await req.user_doc.addToFavs(req.params.article);
    res.send('با موفقیت ثبت شد');
})

router.put('/editFavs', authMiddleware, async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, { favoritesArticles: req.body.favoritesArticles }, { new: true, runValidators: true });
    res.send(user);
});

module.exports = router;