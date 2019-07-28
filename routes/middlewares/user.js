const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const { jwtKey } = require('../../config')

module.exports.authMiddleware = (req, res, next) => {
    if (!req.cookies || !req.cookies['token'])
        return res.redirect('/login');
    const token = jwt.decode(req.cookies['token'], jwtKey);
    if (!token)
        return res.status(401).send('INvalid Token');
    req.user = token;
    next();
}

module.exports.addAuthPayload = (req, res, next) => {
    if (req.cookies && req.cookies['token']) {
        const token = jwt.decode(req.cookies['token'], jwtKey);
        if (!token)
            return res.status(401).send('Invalid Token');
        const user = User.findById(token.id);
        res.locals.user = user;
    }
    next();
}