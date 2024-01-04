import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Badge, Button, Input } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_URL from '../../api/api_url';
import { useTheme } from '@react-navigation/native';

export default function CommentReply(props) {
    const { authState } = useContext(AuthContext);
    const { post_id, replyTo, setComments, setReplyTo } = props;
    const [comment, setComment] = useState('');

    const { colors } = useTheme();

    const createComment = async () => {
        if (!comment.trim()) return;

        const body = {
            comment: comment,
            post_id: post_id,
            parent_id: replyTo.comment_id
        }

        const res = await fetch(`${API_URL.COMMENT}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${String(authState.authToken)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.status === 201) {
            setComment('')
            setComments(prevState => [data, ...prevState])
            setReplyTo({
                comment_id: '',
                username: ''
            })
        } else {
            setComment('')
            alert(data.error)
        }

    }

    return (
        <View>
            {replyTo.username &&
                <Badge
                containerStyle={styles.badge_container}
                badgeStyle={styles.badge}
                textStyle={styles.badge_text}
                value={
                    <View style={styles.badge_wrapper}>
                        <Text style={{color: 'white'}}>{`Reply to @${replyTo.username}`}</Text>
                        <Pressable
                            style={{ paddingStart: 5 }}
                            onPress={() => setReplyTo({
                                comment_id: '',
                                username: ''
                            })}
                        >
                            <Ionicons name='close' color={'white'} size={15} />
                        </Pressable>
                    </View>
                } />
            }
            <Input
                placeholder='Enter your comment...'
                value={comment}
                onChangeText={setComment}
                containerStyle={[styles.input_container, { backgroundColor: colors.background, borderColor: colors.icon_secondary }]}
                inputStyle={{color: colors.text}}
                rightIcon={ <Button
                                onPress={createComment}
                                buttonStyle={[styles.btn, {backgroundColor: colors.icon}]}>
                                <Ionicons
                                    name='paper-plane'
                                    size={20}
                                />
                            </Button>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input_container: {
        borderRadius: 14,
        height: 55,
        borderWidth: 1,
    },
    btn: {
        width: 40
    },
    badge_container: {
        alignSelf: 'flex-start',
    },
    badge: {
        backgroundColor: 'gray',
        borderRadius: 0,
        borderTopEndRadius: 9,
    },
    badge_wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge_text: {
        fontSize: 13
    }
});