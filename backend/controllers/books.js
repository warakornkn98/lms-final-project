const conn = require('../config/db')

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
            results[0].cover_image = results[0].cover_image.toString('base64');

            res.status(200).json(results[0]);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getBooksItem = async (req, res) => {
    const {id} = req.params;
    
    try {
        const sql = "SELECT bi.bookitem_id,b.title,bi.status  FROM books b,bookitem bi WHERE bi.book_id = b.book_id AND bi.bookitem_id = ?";
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
                  book.cover_image = book.cover_image.toString('base64'); // แปลงเป็น Base64
                }
                return book;
            });

            res.status(200).json(books);
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


exports.createBook = async (req, res) => {
    const { title, description, category_id, author, publisher, publication_year, isbn, pages, price, quantity } = req.body;

    console.log(req.body);
    console.log(req.file);

    // Check if cover image is uploaded
    if (!req.file) {
        return res.status(400).json({ message: "Cover image is required" });
    }

    const cover_image = req.file.buffer;  // Get the file buffer

    try {
        const sql = "INSERT INTO books(`title`,`description`,`category_id`,`author`,`publisher`,`publication_year`,`cover_image`,`isbn`,`pages`,`price`,`quantity`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Insert book data into the books table
        conn.execute(sql, [title, description, category_id, author, publisher, publication_year, cover_image, isbn, pages, price, quantity], async (err, result) => {
            if (err) {
                console.error("Error during book insertion:", err.message);
                return res.status(500).json({ message: err.message });
            }

            const book_id = result.insertId;

            // Insert book items into bookitem table
            const insertBookItemSql = "INSERT INTO bookitem (book_id, status) VALUES (?, 'available')";
            const insertPromises = [];
            for (let i = 0; i < quantity; i++) {
                insertPromises.push(
                    new Promise((resolve, reject) => {
                        conn.execute(insertBookItemSql, [book_id], (err, result) => {
                            if (err) {
                                console.error("Error during bookitem insertion:", err.message);
                                return reject(err);
                            }
                            resolve(result);
                        });
                    })
                );
            }

            // Wait for all bookitem insertions to complete
            try {
                await Promise.all(insertPromises);
                console.log("Book and book items inserted successfully");
                res.status(201).json({ message: "Book created successfully", book_id });
            } catch (err) {
                console.error("Error during bookitem Promise.all execution:", err.message);
                return res.status(500).json({ message: err.message });
            }
        });
    } catch (err) {
        console.error("Server Error during book creation:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.updateBook = async (req, res) => {
    const { id } = req.params; 
    const { title, description, category_id, author, publisher, publication_year, cover_image, isbn, pages, price } = req.body;

    console.log(req.body);
    console.log(req.file);

    try {
        // Prepare the SQL update statement
        const sql = `UPDATE books SET
            title = ?,
            description = ?,
            category_id = ?,
            author = ?,
            publisher = ?,
            publication_year = ?,
            cover_image = ?,
            isbn = ?,
            pages = ?,
            price = ?
            WHERE book_id = ?`;

        // Set the cover image based on whether a new file is uploaded
        const coverImage = req.file ? req.file.buffer : cover_image; // Assuming req.file.path contains the image path

        conn.execute(sql, [title, description, category_id, author, publisher, publication_year, coverImage, isbn, pages, price, id], async (err, result) => {
            if (err) {
                console.error("Error during book update:", err.message);
                return res.status(500).json({ message: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Book not found" });
            }

            const currentBookItemsSql = "SELECT COUNT(*) AS currentQuantity FROM bookitem WHERE book_id = ?";
            conn.execute(currentBookItemsSql, [id], async (err, rows) => {
                if (err) {
                    console.error("Error fetching current bookitem quantity:", err.message);
                    return res.status(500).json({ message: err.message });
                }
              
                res.status(200).json({ message: "Book updated successfully" });
            });
        });
    } catch (err) {
        console.error("Server Error during book update:", err.message);
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
            const deleteBookSql = "DELETE FROM books WHERE book_id = ?";
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

exports.createCategory = async (req, res) => {
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
