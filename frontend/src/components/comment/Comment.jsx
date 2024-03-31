import { useTheme } from '@react-navigation/native';
import { useState } from 'react';
import AvatarCustom from '../AvatarCustom';
import { Text } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommentForm from './CommentForm';
import { Pressable } from 'react-native';

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
        <View>
            <AvatarCustom data={{
                avatar: comment.avatar,
                created_by: comment.created_by,
                created_at: comment.created_at,
                username: comment.username,
            }} />
            <Text>{comment.comment}</Text>
            <Ionicons
                name='return-down-back'
                size={24}
                color={colors.icon_secondary}
                style={{ alignSelf: 'flex-end' }}
                onPress={() => setActiveComment({id: comment.id})}
            />

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
                                parentId={reply.id}
                            />))
                    }
                    <Pressable>
                        
                    </Pressable>
                </View>
            }
        </View>
    )

}