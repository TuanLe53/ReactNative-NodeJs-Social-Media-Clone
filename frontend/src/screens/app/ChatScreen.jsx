import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { Avatar } from '@rneui/themed';
import SafeAreaView from "react-native-safe-area-view";
import API_URL from "../../api/api_url";
import AuthContext from '../../context/AuthContext';
import { useTheme } from "@react-navigation/native";

export default function ChatScreen({navigation}) {
    const { authState } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const { colors } = useTheme();

    useEffect(() => {
        const fetchRooms = async () => {
            const res = await fetch(`${API_URL.CHAT}/room`, {
                headers: {
                    'Authorization': `Bearer ${String(authState.authToken)}`
                }
            })
            const data = await res.json()

            if (res.status === 200) {
                setRooms(data)
            }
        }
        navigation.addListener('focus', () =>
            fetchRooms()
        );
    }, [])

    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
            <Text style={[styles.header, {color: colors.text}]}>Chat</Text>
            {rooms.length === 0 ?
            <Text>No message yet.</Text>
                :
                rooms.map((room) => (
                <Pressable
                        onPress={() => navigation.navigate('ChatRoom', {
                            receiver: {
                                avatar: room.avatar,
                                username: room.username
                            },
                            id: room.id
                        })}
                    style={styles.room_container}
                    key={room.id}
                    >
                        <Avatar       
                            source={room.avatar ? { uri: room.avatar } : require('../../../assets/icon.png')}
                            rounded
                            size={50}
                        />
                        <View style={styles.text_container}>
                            <Text style={{color: colors.text, fontSize: 20}}>{room.username}</Text>
                            <Text style={[{color: colors.text_secondary}]}>{room.latest_message}</Text>
                        </View>
                </Pressable>
            ))    
        }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10
    },
    header: {
        textAlign: 'center',
        fontSize: 24
    },
    room_container: {
        height: 60,
        paddingVertical: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text_container: {
        paddingLeft: 5,
    }
})