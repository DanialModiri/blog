const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const { jwtKeyForUsers } = require('../../config')

module.exports.authMiddleware = (req, res, next) => {
    if (!req.cookies || !req.cookies['token'])
        return res.redirect('/login');
    const token = jwt.decode(req.cookies['token'], jwtKey);
    if (!token)
        return res.status(401).send('INvalid Token');
    req.user = token;
    next();
}

module.exports.addAuthPayload = async (req, res, next) => {
    if(!req.cookies || !req.cookies['token'])
        return res.status(401).send('شما حق دسترسی به اینجا را ندارید');
    const decoded = jwt.decode(req.cookies['token'], jwtKeyForUsers);
    if(!decoded)
        return res.status(401).send('شما حق دسترسی به اینجا را ندارید');
    const user = await User.findById(decoded._id);
    req.user_doc = user;
    const user_doc_obj = {...user._doc}
    delete user_doc_obj.password;
    req.user = user_doc_obj;
    next();
}

module.exports.shouldNotAuthenicated = (req, res, next) => {
    if(req.cookies['token'])
        return res.redirect('/');
    next();
}