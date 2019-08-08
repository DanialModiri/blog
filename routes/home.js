
const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment')
const User = require('../models/User')
const Article = require('../models/Article')

router.get('/', async (req, res) => {
    const commentsNumber = await Comment.find().count().exec();
    const articlesNumber = await Article.find().count().exec();
    const usersNumber = await User.find().count().exec();

    const articlesAndYear = await
        Article.aggregate([
            {
                $project: {
                    year: { $year: '$date' }
                }
            },
            {
                $group: {
                    _id: '$year',
                    articlesNumber: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    let: { date: '$_id' },
                    pipeline: [
                        {
                            $addFields: {
                                year: { $year: '$date' }
                            }
                        },
                        {
                            $match: {
                                $expr : {
                                    $eq: ['$year', '$$date']
                                }
                            }
                        }
                    ],
                    as: 'comments'
                },
                
            },
            {
                $addFields: {
                    commentsNumber: { $size: '$comments' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {
                        date: '$_id'
                    },
                    pipeline: [
                        {
                            $addFields: {
                                year: { $year: '$date' }
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$year', '$$date']
                                }
                            }
                        }

                    ],
                    as: 'users'
                }
            },
            {
                $addFields: {
                    usersNumber: { $size: '$users' }
                }
            },
            {
                $project: {
                    users: 0,
                    comments: 0
                }
            },
            {
                $sort: { '_id': -1 }
            }
        ]).exec();
    
    const groupByCity = await User.aggregate([
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
                commentsNumber: { $size: '$comments'}
            }
        },
        {
            $group: {
                _id: '$city',
                number: { $sum: 1 },
                commentsNumber: { $sum: '$commentsNumber' }
            },
        },
        {
            $sort: {number: -1}
        }
    ]).exec();

    res.send({
        users: usersNumber,
        articles: articlesNumber,
        comments: commentsNumber,
        articlesAndYear,
        groupByCity
    });
})

module.exports = router;