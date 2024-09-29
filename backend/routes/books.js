const express = require('express')
const multer = require('multer')
const books = require('../controllers/books')
const { auth,checkAdmin} = require('../Middleware/auth')

const router =  express.Router()

//จัดการไฟล์
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// จัดการหนังสือ
router.get('/books',books.getAllBooks)
router.get('/books/:id',auth,books.getBooks)
router.get('/bookitems/:id',auth,books.getBooksItem)
router.post('/books',checkAdmin,upload.single('cover_image'),books.createBook)
router.put('/books/:id',checkAdmin,upload.single('cover_image'),books.updateBook)
router.delete('/books/:id',checkAdmin,books.deleteBook)

// จัดการ ประเภทหนังสือ
router.get('/category',auth,books.getCategory)
router.post('/category',checkAdmin,books.createCategory)

module.exports = router