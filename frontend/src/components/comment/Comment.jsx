import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AvatarCustom from '../AvatarCustom';
import Reply from './Reply';
import { useState } from 'react';
import API_URL from '../../api/api_url';
import { useTheme } from '@react-navigation/native';

export default function Comment(props) {
    const { data, setReplyTo } = props;
    const [showReply, setShowReply] = useState(false);
    const [replies, setReplies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const { colors } = useTheme();

    const replyToComment = () => {
        setReplyTo({
            comment_id: data.parent_id ? data.parent_id : data.id,
            username: data.username
        })
    }
    
    const showToggle = async () => {
        if (showReply) {
            setShowReply(!showReply)
            setReplies([])
        } else {
            setShowReply(!showReply)
            const res = await fetch(`${API_URL.COMMENT}/reply/${data.id}`)
            const result = await res.json()
            setReplies(result);
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <AvatarCustom data={{
                avatar: data.avatar,
                created_by: data.created_by,
                created_at: data.created_at,
                username: data.username
                }} />
            <Text style={[styles.comment, {color: colors.text}]}>{data.comment}</Text>
            <Ionicons
                name='return-down-back'
                size={24}
                onPress={replyToComment}
                color={colors.icon_secondary}
                style={{alignSelf: 'flex-end'}}
            />
            {showReply &&
                isLoading ?
                <ActivityIndicator />
                :
                replies.map((reply) => (
                    <Reply parent_id={data.id} setReplyTo={setReplyTo} comment={reply} key={reply.id} />  
                ))
            }
            {data.has_reply &&
                <Pressable
                    style={styles.show_btn}
                    onPress={() => showToggle()}
                >
                    <Text style={{ color: colors.icon }}>
                        {showReply ? 'Hide' : 'Show more'}
                    </Text>
                    <Ionicons
                        name={showReply ? 'caret-up' : 'caret-down'}
                        size={20}
                        color={colors.icon}
                    />
                </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    comment: {
        marginLeft: 60,
        fontSize: 17
    },
    show_btn: {
        flexDirection: 'row',
        marginLeft: 50
    }
});

