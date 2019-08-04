const mongoose = require('mongoose');

const User = require('../models/User')
const fs = require('fs')
const path = require('path')

mongoose.connect('mongodb://localhost:27017/blog', async (err) => {
    if (err)
        return console.log(err);
    let users = await User.find().exec();
    users = users.map(item => item._id)
    fs.writeFileSync(path.resolve(__dirname, './USERS_IDS.JSON'), users.join(', '));
})

