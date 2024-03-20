const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const sendResetPasswordEmail = require('../services/email');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    
    try {
        const data = await pool.query('SELECT * FROM account WHERE email = $1', [email])
        const arr = data.rows
        if (arr.length != 0) {
            return res.status(400).json({error: 'Email already in use'})
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: 'Server error' });
                }
                const user = {
                    username,
                    email,
                    password: hash
                }
                pool.query('INSERT INTO account(username, email, pw) VALUES($1, $2, $3)', [user.username, user.email, user.password], (err) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json({error: 'Database error'})
                    } else {
                        res.status(201).send({ message: 'User created. Please login' });
                    }
                })
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
}

const loginUser = async (req, res) => {
    let { email, password } = req.body
    try {
        const data = await pool.query('SELECT username, id, pw FROM account WHERE email = $1', [email])
        const user = data.rows
        if (user.length === 0) {
            res.status(400).json({error: 'User is not found. Please sign up first'})
        } else {
            bcrypt.compare(password, user[0].pw, (err, result) => {
                if (err) {
                    return res.status(500).json({error: 'Server error'})
                }
                if (result != true) {
                    return res.status(401).json({error: 'Wrong password'})
                }
                const accessToken = jwt.sign({
                    'username': user[0].username,
                    'id': user[0].id
                },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: 60 * 5 }
                );
                const refreshToken = jwt.sign({
                    'username': user[0].username,
                    'id': user[0].id
                },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );
                modify_refresh_token(user, refreshToken)
                res.status(200).json({accessToken, refreshToken})
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Database error occurred while signing in!'})
    }
}

const modify_refresh_token = async (user, refreshToken) => {
    const isTokenExist = await pool.query('SELECT refresh_token FROM refresh_token WHERE account_id = $1', [user[0].id])
    if (isTokenExist.rows.length === 0) {
        pool.query('INSERT INTO refresh_token(account_id, refresh_token) VALUES($1, $2)', [user[0].id, refreshToken])
    } else {
        pool.query("UPDATE refresh_token SET refresh_token = $1, valid_from = NOW(), valid_until = NOW() + INTERVAL '1 DAY' WHERE account_id = $2", [refreshToken, user[0].id])
    }
}

const updateRefreshToken = async (req, res) => {
    const header = req.headers['authorization']
    const token = header.split(' ')[1]

    const data = await pool.query('SELECT id, username, email FROM account LEFT JOIN refresh_token ON account.id = refresh_token.account_id WHERE refresh_token.refresh_token = $1', [token])
    const user = data.rows
    if (user.length === 0) return res.sendStatus(403)
    
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err || user[0].username !== decode.username) return res.sendStatus(403)

        const accessToken = jwt.sign({
            'username': decode.username,
            'id': decode.id
        },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: 60*5}
        )
        res.json({accessToken})
    })
}

const resetPasswordToken = async (req, res) => {
    const { email } = req.body;
    
    //Check if user exists
    const userQuery = await pool.query('SELECT id FROM account WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
        return res.status(404).json({error: "User doesn't exists"})
    };
    const userId = userQuery.rows[0]['id'];

    //Check if reset token exists
    const isTokenExist = await pool.query('SELECT * FROM reset_password_token WHERE user_id = $1', [userId]);
    if (isTokenExist.rows.length !== 0) {
        await pool.query('DELETE FROM reset_password_token WHERE user_id = $1', [userId]);
    };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashToken = await bcrypt.hash(resetToken, 10);

    const insertToken = await pool.query('INSERT INTO reset_password_token(user_id, token) VALUES($1, $2)', [userId, hashToken]);
    
    //Send reset password link
    await sendResetPasswordEmail(email, resetToken, userId);

    return res.status(200).json({message: 'Reset password link has seen to your email'})
}

const resetPassword = async (req, res) => {
    const { user_id, token, password } = req.body;

    const tokenQuery = await pool.query('SELECT * FROM reset_password_token WHERE user_id = $1', [user_id]);
    if (tokenQuery.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    const tokenData = tokenQuery.rows[0];

    const isValid = await bcrypt.compare(token, tokenData['token']);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid token' });
    }

    const currentDate = new Date();
    if (tokenData['valid_until'] < currentDate) {
        return res.status(400).json({ error: 'Token expired' });
    }

    const hash = await bcrypt.hash(password, 10);
    const updatePasswordQuery = await pool.query('UPDATE account SET pw = $1 WHERE id = $2', [hash, user_id]);
    const deleteTokenQuery = await pool.query('DELETE FROM reset_password_token WHERE user_id = $1', [user_id]);

    return res.status(200).json({ message: 'Success' });
}

module.exports = { loginUser, registerUser, updateRefreshToken, resetPasswordToken, resetPassword };