import { StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useTheme } from '@react-navigation/native';
import API_URL from '../../api/api_url';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

export default function MessageBtn(props) {
    const { authState } = useContext(AuthContext);
    const { receiver } = props;

    const navigation = useNavigation();
    const { colors } = useTheme();

    const fetchRoom = async () => {
        const res = await fetch(`${API_URL.CHAT}/room-with-user/${receiver.id}`, {
            headers:{'Authorization': `Bearer ${String(authState.authToken)}`}
        });
        const data = await res.json();

        if (res.status === 404) {
            navigation.navigate('ChatRoom', {receiver, id: ''})
        } else if (res.status === 200) {
            navigation.navigate('ChatRoom', {receiver, id: data})
        } else {
            alert(data.error)
        }
    }

    return (
        <Pressable
            onPress={() => fetchRoom()}
            style={[styles.container, {backgroundColor: colors.icon}]}>
            <Ionicons
                name='mail'
                size={20}
                color={'white'}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 30,
        borderRadius: 50
    }
});