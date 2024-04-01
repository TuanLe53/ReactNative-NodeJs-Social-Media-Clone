import { useContext, useState } from 'react';
import API_URL from '../../api/api_url';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/base';
import AuthContext from '../../context/AuthContext';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { useTheme } from '@react-navigation/native';

export default function Comments({ post_id }) {
    const { authState } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);

    const colors = useTheme();

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
            <View style={styles.header_section}>
                <Text style={[{color: colors.text}, styles.header]}>Comments</Text>
                <CommentForm createComment={createComment} />
            </View>
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
    header_section: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10
    },
    header: {
        fontSize: 24,
        marginLeft: 10
    }
})