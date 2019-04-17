const jwt = require('jsonwebtoken')

const badRequest = message => ({
    status: 400,
    message: message || 'Bad Request'
})

const isValidCredential = (email, passoword) =>
    email === process.env.USER_EMAIL && passoword === process.env.USER_PASSWORD

const createToken = (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) {
        return next(badRequest('Missing parameter'))
    }
    const {TOKEN_EXPIRY, TOKEN_SECRET} = process.env

    if (isValidCredential(email, password)) {
        let expires = null
        const payload = {email, password}
        if (TOKEN_EXPIRY) {
            expires = Math.floor(Date.now() / 1000) + parseInt(TOKEN_EXPIRY, 10) * 60 // seconds
            payload.exp = expires
        }
        const token = jwt.sign(payload, TOKEN_SECRET||'!@SEcreaTe3532%(test#4')
        return res.send({token})
    }
    return res.sendStatus(401)
}

const verifyToken = (socket, next) => {

    const {query: {token}} = socket.handshake

    const {TOKEN_SECRET} = process.env
    if (!token) {
        return next(new Error('Authentication error'))
    }
    jwt.verify(token, TOKEN_SECRET, (err) => {
        if (err) {
            return next(new Error('Authentication error'))
        }
        return next()
    })
}

module.exports = {createToken, verifyToken}
