import TimeAgo from '@andordavoti/react-native-timeago';
import { Avatar } from '@rneui/themed';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

export default function AvatarCustom(props) {
    const { data } = props;
    const navigation = useNavigation();
    const { colors } = useTheme();

    return (
        <Pressable
            style={styles.container}
            onPress={() => navigation.navigate('Profile', {id: data.created_by})}
        >
            <Avatar
                source={data.avatar ? {uri: data.avatar} : require('../../assets/icon.png')}
                size={50}
                rounded
            />
            <View style={styles.info}>
                <Text style={[styles.username, {color: colors.text}]}>{data.username}</Text>
                <TimeAgo style={[styles.time, {color: colors.text_secondary}]} dateTo={new Date(data.created_at)}/>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    info: {
        paddingLeft: 5
    },
    username: {
        fontSize: 18,
        fontWeight: 600,
    },
    time: {
        color: 'gray'
    }
});