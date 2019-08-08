const mongoose = require('mongoose');

const User = require('../models/User')
const fs = require('fs')

const users = fs.readFileSync('./dummy/USERS_DATA.JSON');

mongoose.connect('mongodb://localhost:27017/blog', async (err) => {
    await User.remove({  });
    console.log(JSON.parse(users).length)
    if (err)
        return console.log(err);
    User.create(JSON.parse(users)).then(res=> {
        console.log('DONE!')
        mongoose.disconnect();
    }).catch(err => {
        console.log(err);
        mongoose.disconnect();
    })
})

