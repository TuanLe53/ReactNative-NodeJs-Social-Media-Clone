import { useContext, useEffect, useRef, useState } from "react";
import SafeAreaView from 'react-native-safe-area-view';
import Post from "../../components/post/Post";
import API_URL from "../../api/api_url";
import CommentReply from "../../components/comment/CommentReply";
import Comment from "../../components/comment/Comment";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import AuthContext from "../../context/AuthContext";
import { useTheme } from "@react-navigation/native";

export default function PostDetailScreen({ route }) {
    const { authState } = useContext(AuthContext);
    const { id } = route.params;
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState({
        username: '',
        comment_id: '',
    });

    const { colors } = useTheme();

    const fetchPost = async () => {
        const res = await fetch(`${API_URL.POST}/${id}`, {
            headers:{'Authorization': `Bearer ${String(authState.authToken)}`}
        })
        const data = await res.json()
        if (res.status === 200) {
            setPost(data)
        } else {
            alert(data.error)
        }
    }

    const fetchComment = async () => {
        const res = await fetch(`${API_URL.COMMENT}/${id}`)
        const data = await res.json()
        if (res.status === 200) {
            setComments(data)
        }
    }
    
    useEffect(() => {
        fetchPost()
        fetchComment()
    }, [])
    
    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
            {post
                ?
                <>      
                    <ScrollView>
                        <Post data={post} />
                        <View style={styles.comment_container}>
                            <Text style={[styles.comment_header, {color: colors.text}]}>Comments</Text>
                            {comments.map((comment) => (
                                <Comment
                                    data={comment}
                                    setReplyTo={setReplyTo}
                                    key={comment.id} />
                            ))}
                        </View>
                    </ScrollView>
                    <CommentReply post_id={id} replyTo={replyTo} setComments={setComments} setReplyTo={setReplyTo} />
                </>
                :
                <ActivityIndicator />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    comment_container: {
        borderTopColor: 'gray',
        borderTopWidth: 1,
        paddingHorizontal: 10,
        paddingBottom: 55
    },
    comment_header: {
        fontSize: 24,
        fontWeight: 600
    }
});