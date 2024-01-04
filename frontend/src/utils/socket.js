import { io } from 'socket.io-client';

const socket = io('http://192.168.1.138:8080', {
    autoConnect: false,
    transports: ['websocket'],
});
export default socket;