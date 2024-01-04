import { StyleSheet, View, Text } from "react-native";
import AvatarCustom from "../AvatarCustom";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from "@react-navigation/native";

export default function Reply(props) {
    const { setReplyTo, comment } = props;

    const { colors } = useTheme();

    const replyToComment = (reply) => {
        setReplyTo({
            comment_id: reply.parent_id,
            username: reply.username
        })
    }

    return (
        <View style={{
            paddingVertical: 10,
            marginLeft: 50
        }}>
            <AvatarCustom data={{
                avatar: comment.avatar,
                created_by: comment.created_by,
                created_at: comment.created_at,
                username: comment.username
            }}/>
            <Text style={[styles.comment, {color: colors.text}]}>{comment.comment}</Text>
            <Ionicons
                name='return-down-back'
                color={colors.icon_secondary}
                size={24}
                onPress={() => replyToComment(comment)}
                style={{alignSelf: 'flex-end'}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        marginLeft: 60,
        fontSize: 17
    },
});