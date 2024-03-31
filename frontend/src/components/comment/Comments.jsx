import { useContext, useState } from 'react';
import API_URL from '../../api/api_url';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/base';
import AvatarCustom from '../AvatarCustom';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import CommentForm from './CommentForm';

function Comment({ comment, replies, activeComment, setActiveComment, createComment, parentId = null }) {
    const [showReplies, setShowReplies] = useState(false);

    const { colors } = useTheme();

    const showReplyForm = activeComment && activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;

    return (
        <View style={styles.container}>
            <AvatarCustom data={{
                avatar: comment.avatar,
                created_by: comment.created_by,
                created_at: comment.created_at,
                username: comment.username,
            }} />
            <Text style={[styles.comment, {color: colors.text}]}>{comment.comment}</Text>
            
            <Ionicons
                name='return-down-back'
                size={24}
                color={colors.icon_secondary}
                style={{ alignSelf: 'flex-end' }}
                onPress={() => setActiveComment({id: comment.id})}
            />
            {showReplyForm && (
                <CommentForm createComment={(text) => createComment(text, replyId)}/>
            )}

            {replies.length > 0 &&
                <View>
                    {showReplies &&
                    replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            replies={[]}
                            setActiveComment={setActiveComment}
                            activeComment={activeComment}
                            parentId={reply.id}
                        />))
                    }
                    <Pressable
                        onPress={() => setShowReplies(!showReplies)}
                        style={[styles.show_btn]}
                    >
                        <Text style={{color: colors.icon}}>{showReplies ? 'Hide' : 'More'}</Text>
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

export default function Comments({ post_id }) {
    const { authState } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);

    const parentComments = comments.filter(
        (comment) => comment.parent_id === null
    );

    const getReplies = (comment_id) => {
        let replies = comments.filter((comment) => comment.parent_id === comment_id)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        return replies;
    };

    const createComment = async (text, parent_id = null) => {
        const body = {
            comment: text,
            post_id: post_id,
            parent_id: parent_id
        }

        const res = await fetch(`${API_URL.POST}/${post_id}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${String(authState.authToken)}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })

        const data = await res.json();
        if (res.status !== 201) {
            alert(data.error)
            return;
        }

        setComments([data, ...comments])
        setActiveComment(null)
    };

    const fetchComment = async () => {
        const res = await fetch(`${API_URL.POST}/${post_id}/comments`)
        const data = await res.json()
        if (res.status === 200) setComments(data);
        return data
    };

    const { isError, isLoading } = useQuery({
        queryKey: ['comments'],
        queryFn: fetchComment,
    })

    if (isLoading) return <ActivityIndicator />
    if(isError) return <Text>Error</Text>

    return (
        <View>
            <Text>Comments</Text>
            <CommentForm createComment={createComment} />
            {parentComments.map((comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    replies={getReplies(comment.id)}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                    createComment={createComment}
                />
            ))}
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