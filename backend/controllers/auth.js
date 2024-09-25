const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'jwtsecret';
const saltRounds = 10
const conn = require('../Config/db')


exports.login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Please provide username and password'
        });
    }

    const sql = "SELECT * FROM user WHERE username = ?";
    conn.execute(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const payload = {
            user: {
                username: user.username,
                role: user.role,
            },
        };

        jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error generating token'
                });
            }
            res.status(200).json({ token, payload });
        });
    });

};

exports.getUserinfo = (req, res) => {
    const token = req.headers['authtoken'].split(' ')[1];
    if (!token) return res.status(403).send('Token is required');
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send('Invalid Token');
      req.user = decoded.user;
    });
    return res.json({ user: req.user });
};