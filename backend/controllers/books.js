const conn = require('../Config/db')

// const bookData = {
//     book_id,title,description,category_id,author_id,publisher_id,publication_year,cover_image,isbn,pages,price,quantity,date_added
// }

exports.getBooks = async (req, res) => {
    const {id} = req.params;
    
    try {
        const sql = "SELECT * FROM books WHERE book_id = ?";
        conn.execute(sql, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            
            res.status(200).json(results[0]);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const sql = "SELECT * FROM books";
        conn.execute(sql, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const books = results.map(book => {
                if (book.cover_image) {
                  book.cover_image = book.cover_image.toString('base64');
                }
                return book;
            });

            res.status(200).json(books);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// exports.getBooksDetail = async (req, res) => {
//     const {id} = req.params;
    
//     try {
//         const sql = "SELECT b.id,b.name,`desc`,bt.name booktype,a.name author,p.name publisher, publish_year, price, available_quantity, total_quantity  FROM book b,book_type bt,author a,publisher p WHERE b.booktype_id = bt.id AND b.author_id=a.id AND b.publisher_id=p.id AND b.id = ?";
//         conn.execute(sql, [id], (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: err.message });
//             }
//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Book not found" });
//             }
//             res.status(200).json(results[0]);
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };


exports.createBook = async (req, res) => {
    const { title,description,category_id,author_id,publisher_id,publication_year,cover_image,isbn,pages,price,quantity,date_added} = req.body;

    try {
        const sql = "INSERT INTO books(`title`,`description`,`category_id`,`author_id`,`publisher_id`,`publication_year`,`cover_image`,`isbn`,`pages`,`price`,`quantity`,`date_added`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        conn.execute(sql, [title,description,category_id,author_id,publisher_id,publication_year,cover_image,isbn,pages,price,quantity,date_added], (err,result) => {
            if(err){
                res.status(500).json({message:err.message})
            }
            const book_id = result.insertId;

            const insertBookItemSql = "INSERT INTO bookitem (book_id, status) VALUES (?, 'available')";
            for (let i = 0; i < quantity; i++) {
                conn.execute(insertBookItemSql, [book_id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }
                });
            }
            
            res.status(201).json({ message: "Book created successfully", book_id: result.insertId});
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error1" });
    }
    
};

// exports.createBookItems = async (req, res) => {
//     const { book_id, total_quantity } = req.body;

//     try {
//         const checkBookSql = "SELECT * FROM books WHERE book_id = ?";
//         conn.execute(checkBookSql, [book_id], (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: err.message });
//             }
//             if (results.length === 0) {
//                 return res.status(404).json({ message: "Book not found" });
//             }

//             const insertBookItemSql = "INSERT INTO bookitem (book_id, book_status) VALUES (?, 'available')";
//             for (let i = 0; i < total_quantity; i++) {
//                 conn.execute(insertBookItemSql, [book_id], (err, result) => {
//                     if (err) {
//                         return res.status(500).json({ message: err.message });
//                     }
//                 });
//             }

//             res.status(201).json({
//                 message: `Added ${total_quantity} book items for book_id ${book_id}`
//             });
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: "Server Error" });
//     }
// };


exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { name,desc,booktype_id,author_id,publisher_id,publish_year,price,total_quantity,available_quantity } = req.body;

    try {
        const sql = `UPDATE books SET
        book_id = ?
        title = ?
        description = ?
        category_id = ?
        author_id = ?
        publisher_id = ?
        publication_year = ?
        cover_image = ?
        isbn = ?
        pages = ?
        price = ?
        quantity = ?
        date_added = ?
        WHERE book_id = ?`;
        conn.execute(sql, [name,desc,booktype_id,author_id,publisher_id,publish_year,price,total_quantity,available_quantity,id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.status(200).json({ message: "Book updated successfully" });
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete associated book items first (to maintain referential integrity)
        const deleteBookItemsSql = "DELETE FROM bookitem WHERE book_id = ?";
        conn.execute(deleteBookItemsSql, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            // Then delete the book
            const deleteBookSql = "DELETE FROM books WHERE id = ?";
            conn.execute(deleteBookSql, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "Book not found" });
                }
                res.status(200).json({ message: "Book deleted successfully" });
            });
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const sql = "SELECT * from category";
        conn.execute(sql, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.getAuthor = async (req, res) => {
    try {
        const sql = "SELECT * from author";
        conn.execute(sql, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.getPublisher = async (req, res) => {
    try {
        const sql = "SELECT * from publisher";
        conn.execute(sql, [], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.setCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const sql = "INSERT INTO category(name) VALUES(?)";
        conn.execute(sql, [name], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.setAuthor = async (req, res) => {
    try {
        const { name } = req.body;

        const sql = "INSERT INTO author(name) VALUES(?)";
        conn.execute(sql, [name], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.setPublisher = async (req, res) => {
    try {
        const { name } = req.body;

        const sql = "INSERT INTO publisher(name) VALUES(?)";
        conn.execute(sql, [name], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(200).json(results);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};