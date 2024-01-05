import { Input } from '@rneui/themed';
import { StyleSheet, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../utils/socket';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import API_URL from '../../api/api_url';
import { useTheme } from '@react-navigation/native';

export default function SendMessage(props) {
    const { roomId, setRoomId, receiver } = props;
    const { user, authState } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    const { colors } = useTheme();

    const sendMessage = (id) => {
        socket.emit('sendMessage', {
            roomId: id,
            message: message,
            created_by: user.id
        });
        setMessage('');
        Keyboard.dismiss();
    }
    
    const handleSendMessage = async () => {
        if (!message) return;
        if (roomId) {
            sendMessage(roomId)
        } else {
            const res = await fetch(`${API_URL.CHAT}/room/${receiver.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authState.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: message})
            })
            const roomId = await res.json()
            setRoomId(roomId);
            socket.emit('join room', roomId);
            sendMessage(roomId);
        }
    }


    return (
        <Input
            containerStyle={[{ backgroundColor: colors.background, height: 50 }]}
            inputContainerStyle={{}}
            inputStyle={styles.input}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
            rightIconContainerStyle={{padding: 4}}
            rightIcon={
                <Ionicons
                    name='paper-plane'
                    size={24}
                    color={colors.icon}
                    onPress={handleSendMessage}
            />}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'gray',
        borderRadius: 9,
    }
})