import { useTheme } from '@react-navigation/native';
import { useState } from 'react';
import AvatarCustom from '../AvatarCustom';
import { Text } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommentForm from './CommentForm';
import { Pressable, StyleSheet, View } from 'react-native';

export default function Comment({
    comment,
    replies,
    activeComment,
    setActiveComment,
    createComment,
    parentId = null
}) {

    const [showReplies, setShowReplies] = useState(false);

    const { colors } = useTheme();
    
    const showReplyForm = activeComment && activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;

    return (
        <View style={[parentId !== null && {marginLeft: 50}, styles.container]}>
            <AvatarCustom data={{
                avatar: comment.avatar,
                created_by: comment.created_by,
                created_at: comment.created_at,
                username: comment.username,
            }} />
            <View style={styles.comment_section}>
                <Text style={[styles.comment, {color: colors.text}]}>{comment.comment}</Text>
                <Ionicons
                    name='return-down-back'
                    size={24}
                    color={colors.icon_secondary}
                    onPress={() => setActiveComment({id: comment.id})}
                />
            </View>

            {showReplyForm && (
                <CommentForm createComment={(text) => createComment(text, replyId)} />
            )}

            {replies.length > 0 &&
                <View>
                    {showReplies &&
                        replies.map((reply) =>(
                            <Comment
                                key={reply.id}
                                comment={reply}
                                replies={[]}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                parentId={comment.id}
                                createComment={createComment}
                            />))
                    }
                    <Pressable
                        onPress={() => setShowReplies(!showReplies)}
                        style={[styles.show_btn]}
                    >
                        <Text style={{color: colors.icon, fontSize: 18}}>{showReplies ? 'Hide' : 'More'}</Text>
                        <Ionicons
                            name={showReplies ? 'caret-up' : 'caret-down'}
                            size={20}
                            color={colors.icon}
                        />
                    </Pressable>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    },
    comment_section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    comment: {
        marginLeft: 60,
        fontSize: 17
    },
    show_btn: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 5,
        marginLeft: 57,
        width: 70
    }
});