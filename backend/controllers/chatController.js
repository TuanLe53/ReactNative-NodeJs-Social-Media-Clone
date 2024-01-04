const pool = require('../db/db');

const getRoomsByUser = async (req, res) => {
    const { id } = req.user;
    const rooms = [];
    try {
        const roomQuery = await pool.query('SELECT room_id AS id, user_id, username, avatar FROM room_member LEFT JOIN account ON room_member.user_id = account.id WHERE room_id IN (SELECT room_id FROM room_member WHERE user_id = $1) AND user_id != $2', [id, id]);
        if (roomQuery.rows.length === 0) {
            return res.status(404).json({message: 'Not found'})
        };
        await Promise.all(roomQuery.rows.map( async (room) => {
            const messageQuery = await pool.query('SELECT message_text AS latest_message FROM message WHERE created_at = (SELECT MAX(created_at) FROM message WHERE room_id = $1)', [room['id']]);
            const latest_message = await messageQuery.rows[0]['latest_message'];
            room.latest_message = latest_message;

            rooms.push(room)
        }))
        // const rooms = roomQuery.rows;
        res.status(200).json(rooms);

    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
}

const getRoomBetweenUsers = async (req, res) => {
    const { id } = req.user;
    const { receiver } = req.params;

    try {
        const roomQuery = await pool.query('SELECT room_id FROM room_member WHERE user_id = $1 INTERSECT SELECT room_id FROM room_member WHERE user_id = $2', [id, receiver]);
        if (roomQuery.rows.length === 0) {
            return res.status(404).json({message: "Don't have any conversation yet."})
        }

        const roomId = roomQuery.rows[0]['room_id'];
        res.status(200).json(roomId);

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

const createRoom = async (req, res) => {
    const { id } = req.user;
    const { receiver } = req.params;
    const { message } = req.body;
    const members = [id, receiver];

    try {
        const roomQuery = await pool.query('INSERT INTO room DEFAULT VALUES RETURNING *')
        const roomId = await roomQuery.rows[0]['id']
        
        await Promise.all(members.map(async (user) => {
            pool.query('INSERT INTO room_member (room_id, user_id) VALUES($1, $2)', [roomId, user]);
        }))
        
        res.status(201).json(roomId);

    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'Server error'})
    }
}

const getMessage = async (req, res) => {
    const { roomId } = req.params;

    try {
        const messageQuery = await pool.query('SELECT message_text AS content, created_at, created_by FROM message WHERE room_id = $1', [roomId])
        const messages = messageQuery.rows

        res.status(200).json(messages)
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
};

module.exports = { getRoomsByUser, getRoomBetweenUsers, getMessage, createRoom };