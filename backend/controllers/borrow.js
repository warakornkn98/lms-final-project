const conn = require('../config/db');

exports.borrowBook = (req, res) => {
    const { bookitem_id, user_id } = req.body;

    const sqlCheckBookStatus = "SELECT status FROM bookitem WHERE bookitem_id = ?";
    
    conn.execute(sqlCheckBookStatus, [bookitem_id], (err, bookResults) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        const bookStatus = bookResults[0].status;
        if (bookStatus !== 'available') {
            return res.status(400).json({ message: "Book is not available for borrowing" });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() +7);

        const sqlInsert = "INSERT INTO borrow (bookitem_id, user_id, borrow_date, due_date) VALUES (?, ?, NOW(), ?)";
        
        conn.execute(sqlInsert, [bookitem_id, user_id, dueDate], (err, borrowResult) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const sqlUpdateBookItem = "UPDATE bookitem SET status = 'borrowed' WHERE bookitem_id = ?";
            
            conn.execute(sqlUpdateBookItem, [bookitem_id], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                res.status(201).json({ message: "Book borrowed successfully", due_date: dueDate });
            });
        });
    });
};


exports.returnBook = (req, res) => {
    const { bookitem_id } = req.body;

    const sqlCheckBorrow = `
        SELECT id, due_date 
        FROM borrow 
        WHERE bookitem_id = ? AND return_date IS NULL
    `;
    
    conn.execute(sqlCheckBorrow, [bookitem_id], (err, borrowResults) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        if (borrowResults.length === 0) {
            return res.status(400).json({ message: "Book has already been returned or was never borrowed" });
        }

        const { id, due_date } = borrowResults[0];
        const currentDate = new Date();

        let returnStatus = currentDate <= due_date ? 'time' : 'late';

        const sqlUpdateBorrow = `
            UPDATE borrow 
            SET return_date = NOW(), status = ? 
            WHERE id = ?
        `;
        
        conn.execute(sqlUpdateBorrow, [returnStatus, id], (err, updateBorrowResult) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const sqlUpdateBookItem = "UPDATE bookitem SET status = 'available' WHERE bookitem_id = ?";
            
            conn.execute(sqlUpdateBookItem, [bookitem_id], (err, updateBookItemResult) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }


                res.status(200).json({ message: "Book returned successfully", return_status: returnStatus });
            });
        });
    });
};



exports.getUserByUsername = (req, res) => {
    const { username } = req.params;
    console.log(username);
    
    const sql = 'SELECT id,username,firstname,lastname,role FROM user WHERE username = ?';

    conn.execute(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};


exports.getUserBorrowHistory = (req, res) => {
    const { id } = req.params;

    let sql = 'SELECT * FROM borrow WHERE user_id = ?';
    
    conn.execute(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};