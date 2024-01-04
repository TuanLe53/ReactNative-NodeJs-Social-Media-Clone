import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AuthContext from "../../context/AuthContext";
import { Avatar } from "@rneui/themed";

export default function Message(props) {
    const { user } = useContext(AuthContext);
    const { message, receiver } = props;

    return (
        <View style={message.created_by === user.id ?
            {alignItems: 'flex-end'}
            :
            [styles.container, { alignItems: 'flex-start'}]}
        >
            {message.created_by !== user.id &&
                <Avatar
                source={receiver.avatar ? { uri: receiver.avatar } : require('../../../assets/icon.png')}
                rounded
                />
            }
            <Pressable style={styles.message_container}>
                <Text style={styles.message}>{message.content}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    message_container: {
        backgroundColor: '#00B2FF',
        maxWidth: 180,
        marginBottom: 10,
        padding: 5,
        borderRadius: 9,
        marginLeft: 5
    },
    message: {
        fontSize: 16
    }
});