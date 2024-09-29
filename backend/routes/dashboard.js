const express = require('express')
const { getDashboardData } = require('../controllers/dashboard');
const { checkAdmin } = require('../Middleware/auth');

const router =  express.Router()

router.get('/dashboard',checkAdmin, getDashboardData)

module.exports = router