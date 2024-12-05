const jwt = require('jsonwebtoken')
const config = require('./global')
const { json } = require('express')

function verifyToken(req, res, next){
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(404),json({
            auth: false,
            message: 'NO hay token'
        })
    }

    const decoded = jwt.verify(token, config.secret)

    req.userId = decoded.userId
    next()
}

module.exports = verifyToken