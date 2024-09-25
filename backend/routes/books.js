const express = require('express')
const books = require('../controllers/books')
const { auth,checkAdmin} = require('../Middleware/auth')

const router =  express.Router()

// จัดการหนังสือ

router.get('/books',books.getAllBooks)
router.get('/books/:id',auth,books.getBooks)
router.post('/books',checkAdmin,books.createBook)
router.put('/books/:id',checkAdmin,books.updateBook)
router.delete('/books/:id',checkAdmin,books.deleteBook)

// จัดการ ประเภทหนังสือ
router.get('/category',auth,books.getCategory)
router.post('/category',checkAdmin,books.setCategory)

// จัดการ ผู้แต่ง
router.get('/author',auth,books.getAuthor)
router.post('/author',checkAdmin,books.setAuthor)

// จัดการ สำนักพิมพ์
router.get('/publisher',auth,books.getPublisher)
router.post('/publisher',checkAdmin,books.setPublisher)

module.exports = router