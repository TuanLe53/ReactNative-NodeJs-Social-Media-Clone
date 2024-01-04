import { Avatar } from '@rneui/themed';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_URL from '../../api/api_url';
import SendMessage from '../../components/chat/SendMessage';
import socket from '../../utils/socket';
import Message from '../../components/chat/Message';
import { useTheme } from '@react-navigation/native';

export default function ChatRoom({route, navigation}) {
    const { receiver, id } = route.params;
    const [roomId, setRoomId] = useState(id);
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef();
    const { colors } = useTheme();

    useEffect(() => {
        const fetchMessage = async () => {
            const res = await fetch(`${API_URL.CHAT}/message/${roomId}`);
            const data = await res.json();
            if (res.status === 200) {
                setMessages(data)
            } else {
                alert(data.error)
            }
        }
        if (roomId) {
            fetchMessage();
            socket.emit('join room', roomId);
        }
        
        socket.on('newMessage', (data) => {
            setMessages(prevState => [...prevState, data])
        })

        return () => {
            socket.emit('leave room', roomId);
        }
    }, [socket])

    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
            <View style={[styles.header, {backgroundColor: colors.icon}]}>
                <Ionicons
                    name='arrow-back'
                    size={28}
                    style={styles.back_btn}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.wrapper}>
                    <Avatar
                        source={receiver.avatar ? { uri: receiver.avatar } : require('../../../assets/icon.png')}
                        size={45}
                        rounded
                    />
                    <Text style={{
                        fontSize: 18,
                        padding: 5
                    }}>{receiver.username}</Text>
                </View>
            </View>
            <ScrollView
                style={styles.message_container}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({animated: true})}
            >
                {messages.map((message, index) => (
                    <Message message={message} key={index} receiver={receiver} />
                ))}
            </ScrollView>
            <SendMessage roomId={roomId} setRoomId={setRoomId} receiver={receiver}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    back_btn: {
        flex: 1,
    },
    wrapper: {
        flex: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    message_container: {
        padding: 10
    }
});