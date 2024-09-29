const express = require('express')

const router =  express.Router()

const borrow = require('../controllers/borrow')
const { auth,checkAdmin} = require('../Middleware/auth')


router.post('/borrow',checkAdmin ,borrow.borrowBook)
router.post('/return',checkAdmin ,borrow.returnBook)

router.get('/users/:username',checkAdmin ,borrow.getUserByUsername);
router.get('/borrow/:id',checkAdmin ,borrow.getUserBorrowHistory);


module.exports = router