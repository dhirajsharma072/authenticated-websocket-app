const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()

router.post('/auth/token', authController.createToken)

module.exports = router
