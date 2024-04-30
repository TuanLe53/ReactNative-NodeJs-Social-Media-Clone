const pool = require('../db/db');
const { Expo } = require('expo-server-sdk');

const sendPushNotification = async (ExpoPushToken, username, message) => {
    const expo = new Expo();
    const chunks = expo.chunkPushNotifications([
        {
            to: ExpoPushToken,
            sound: "default",
            title: username,
            body: message
        }
    ])

    for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
}

const pushMessageNotification = async (data) => {
    const userQuery = await pool.query('SELECT user_id FROM room_member WHERE room_id =$1 AND user_id != $2', [data.roomId, data.created_by]);
    const receiver = userQuery.rows[0].user_id;

    const tokenQuery = await pool.query('SELECT token FROM notification_token WHERE user_id = $1', [receiver]);
    const token = tokenQuery.rows[0].token;


    if (Expo.isExpoPushToken(token)) {
        await sendPushNotification(token, data.username, data.message)
    }
}

module.exports = pushMessageNotification;