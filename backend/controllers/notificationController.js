const pool = require('../db/db');

const assignDeviceToken = async (req, res) => {
    const { id } = req.user;
    const { token } = req.body;
    
    const tokenQuery = await pool.query('SELECT * FROM notification_token WHERE user_id = $1', [id]);
    if (tokenQuery.rows.length === 0) {    
        pool.query('INSERT INTO notification_token(user_id, token) VALUES($1, $2)', [id, token], (err) => {
            if (err) {
                return res.status(500).json({message: 'Server error'})
            }    
        })
    }
    else {
        pool.query('UPDATE notification_token SET token = $1 WHERE user_id = $2', [token, id], (err) => {
            if (err) {
                return res.status(500).json({message: 'Server error'})
            }
        })
    }

    res.status(201).json({
        message: 'Success'
    })
}

module.exports = { assignDeviceToken };