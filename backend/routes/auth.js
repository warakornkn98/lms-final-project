const express = require('express')
const { login, getUserinfo } = require('../controllers/auth')

const router =  express.Router()

router.post('/login',login)
router.get('/decode-token',getUserinfo)

module.exports = router