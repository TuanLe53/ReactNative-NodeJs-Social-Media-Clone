import { useNavigation, useTheme } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function UserComponent(props) {
    const { profile } = props;
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <Pressable
            style={styles.container}
            onPress={() => navigation.navigate('Profile', {id: profile.id})}
        >
            <Avatar
                source={profile.avatar ? {uri: profile.avatar} : require('../../assets/icon.png')}
                size={50}
                rounded
            />
            <View style={{paddingLeft: 5}}>
                <Text style={[styles.username, {color: colors.text}]}>{profile.username}</Text>
                <Text style={styles.id}>#{profile.id}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        padding: 10
    },
    username: {
        fontSize: 20,
        fontWeight: 600
    },
    id: {
        color: 'gray',
        fontSize: 11
    }
});