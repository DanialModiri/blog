const express = require('express');
const User = require('../models/User')
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.aggregate([
        {
            $group: {
                _id: '$city',
            }
        },
        {
            $lookup: {
                
            }
        }
    ]).exec();

    res.send(users);
})

router.get('/:ostan', async (req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                city: req.params.ostan
            }
        },
        {
            $lookup: {
                from: 'comments',
                foreignField: 'user',
                localField: '_id',
                as: 'comments'
            }
        },
        {
            $addFields: {
                commentsNumber: { $size: '$comments' }
            }
        },
        {
            $addFields: {
                year: { $year: '$date' }
            }
        },
        {
            $group: {
                _id: '$year',
                usersNumber: { $sum: 1 },
                commentsNumber: { $sum: '$commentsNumber' }
            }
        },
        {
            $sort: { year: -1 }
        }
    ]).exec();

    res.send(users);
})


router.get('/q/:q', async (req, res) => {
    const states = await User.aggregate([
        {
            $group: {
                _id: '$city'
            }
        },
        {
            $match: {
                _id: { $regex: `.*${req.params.q}.*` }
            }
        }
    ]).exec()
    res.send(states);
})

module.exports = router;