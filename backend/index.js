const express = require('express');
const morgan = require('morgan');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3500;

app.use(morgan('dev'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/post', require('./routes/post'));
app.use('/chat', require('./routes/chat'));
app.use('/notifications', require('./routes/notification'));

app.use('/images/avatar', express.static('storage/avatar'));
app.use('/images/cover', express.static('storage/cover'));
app.use('/images/post', express.static('storage/post'));


const server = app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

const { Server } = require('socket.io');
const pool = require('./db/db');
const pushMessageNotification = require('./services/notification');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on('connection', async (socket) => {
    console.log(`${socket.id} connected`);
    
    socket.on('join room', (roomId) => {
        socket.join(roomId)
        console.log(`Joined room with id: ${roomId}`)
    })

    socket.on('leave room', (roomId) => {
        socket.leave(roomId)
        console.log(`Left room with id: ${roomId}`)
    })

    socket.on('sendMessage', async (data) => {
        const messQuery = await pool.query('INSERT INTO message(room_id, message_text, created_by) VALUES($1, $2, $3) RETURNING message_text AS content, created_at, created_by', [data.roomId, data.message, data.created_by])
        const message = messQuery.rows[0];
        io.to(data.roomId).emit('newMessage', message);
        pushMessageNotification(data);
    })

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log('user disconnect');
    })
});
