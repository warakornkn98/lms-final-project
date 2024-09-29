const conn = require('../config/db');

const getDashboardData = async (req, res) => {
    const totalBooks = 'SELECT COUNT(*) AS total_books FROM bookitem;';
    
    const booksByCate = `
        SELECT 
            c.name, 
            COUNT(bi.bookitem_id) AS total_quantity
        FROM 
            books b
        JOIN 
            bookitem bi ON b.book_id = bi.book_id
        JOIN 
            category c ON b.category_id = c.category_id
        GROUP BY 
            b.category_id;
    `;
    
    const borrowedBooks = 'SELECT COUNT(*) AS borrowed_books FROM bookitem WHERE status = "borrowed";';

    const borrowedBooksByMonth = `
        SELECT 
            DATE_FORMAT(borrow_date, '%Y-%m') AS month,
            COUNT(*) AS total_borrowed
        FROM 
            borrow
        GROUP BY 
            month
        ORDER BY 
            month;
    `;

    const availableBooks = 'SELECT COUNT(*) AS available_books FROM bookitem WHERE status = "available";';
    
    const lostBooks = 'SELECT COUNT(*) AS lost_books FROM bookitem WHERE status = "lost";';

    const borrowedThisYear = `
        SELECT COUNT(*) AS borrowed_this_year 
        FROM borrow 
        WHERE YEAR(borrow_date) = YEAR(CURDATE());
    `;

    const borrowedThisMonth = `
        SELECT COUNT(*) AS borrowed_this_month 
        FROM borrow 
        WHERE MONTH(borrow_date) = MONTH(CURDATE()) AND YEAR(borrow_date) = YEAR(CURDATE());
    `;

    const returnedOnTime = `
        SELECT COUNT(*) AS returned_on_time 
        FROM borrow 
        WHERE status = 'time';
    `;

    const returnedLate = `
        SELECT COUNT(*) AS returned_late 
        FROM borrow 
        WHERE status = 'late';
    `;

    try {
        const [totalBooksResult] = await conn.promise().query(totalBooks);
        const [booksByTypeResult] = await conn.promise().query(booksByCate);
        const [borrowedBooksResult] = await conn.promise().query(borrowedBooks);
        const [borrowedBooksByMonthResult] = await conn.promise().query(borrowedBooksByMonth);
        const [availableBooksResult] = await conn.promise().query(availableBooks);
        const [lostBooksResult] = await conn.promise().query(lostBooks);
        const [borrowedThisYearResult] = await conn.promise().query(borrowedThisYear);
        const [borrowedThisMonthResult] = await conn.promise().query(borrowedThisMonth);
        const [returnedOnTimeResult] = await conn.promise().query(returnedOnTime);
        const [returnedLateResult] = await conn.promise().query(returnedLate);

        res.json({
            totalBooks: totalBooksResult[0].total_books,
            booksByType: booksByTypeResult,
            borrowedBooks: borrowedBooksResult[0].borrowed_books,
            borrowedBooksByMonth: borrowedBooksByMonthResult,
            availableBooks: availableBooksResult[0].available_books,
            lostBooks: lostBooksResult[0].lost_books,
            borrowedThisYear: borrowedThisYearResult[0].borrowed_this_year,
            borrowedThisMonth: borrowedThisMonthResult[0].borrowed_this_month,
            returnedOnTime: returnedOnTimeResult[0].returned_on_time,
            returnedLate: returnedLateResult[0].returned_late
        });
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports = {
    getDashboardData
};
