import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { useContext, useEffect, useState } from 'react';
import API_URL from '../../api/api_url';
import EditBio from '../../components/profile/EditBio';
import CoverImg from '../../components/profile/CoverImg';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import Post from '../../components/post/Post';
import FollowBtn from '../../components/profile/FollowBtn';
import AuthContext from '../../context/AuthContext';
import MessageBtn from '../../components/profile/MessageBtn';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen({ route }) {
    const { id } = route.params;
    const { user, authState } = useContext(AuthContext);
    const isOwner = id === user.id;
    const [profile, setProfile] = useState();
    const [posts, setPosts] = useState([]);

    const { colors } = useTheme();
    
    
    
    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch(`${API_URL.PROFILE}/${id}`)
            const data = await res.json()
            if (res.status === 200) {
                setProfile(data)
            } else {
                console.log(data.error)
            }
        };
        
        const fetchUserPosts = async () => {
            const res = await fetch(`${API_URL.POST}/user/${id}`, {
                headers: { 'Authorization': `Bearer ${String(authState.authToken)}` }
            })
            const data = await res.json()
            if (res.status !== 200) {
                return alert(data.error)
            }
            if (data.length !== 0) {
                setPosts(data)
            }
        };

        fetchProfile();
        fetchUserPosts();
    }, [])

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            {profile ?
                <ScrollView>
                    <CoverImg coverPhoto={profile.cover_photo} isOwner={isOwner} />
                    <View style={styles.user_info_container}>
                        <View style={styles.test_container}>
                            <ProfileAvatar avatar={profile.avatar} isOwner={isOwner}/>
                            {!isOwner &&
                                <View style={styles.group_btn}>                                
                                    <MessageBtn receiver={{
                                        id: profile.id,
                                        username: profile.username,
                                        avatar: profile.avatar
                                    }} />
                                    <FollowBtn profile_id={id} />
                                </View>
                            }
                        </View>
                        <View style={styles.info_wrapper}>
                            <Text style={[styles.username, {color: colors.text}]}>{profile.username}</Text>
                            <EditBio bio={profile.bio} isOwner={isOwner} />
                            <View style={styles.follow_wrapper}>
                                <Text style={{color: colors.text}}>{profile.follower} Followers</Text>
                                <Text style={{color: colors.text}}>{profile.following} Following</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.posts_container}>
                    {posts.length === 0 ?
                        <Text style={styles.posts_container_text}>No posts yet</Text>
                            :
                        <>
                            {posts.map((post) => (
                                <Post data={post} key={post.id} />
                            ))}        
                        </>
                    }
                    </View>
                </ScrollView>
                :
                <ActivityIndicator />
            }

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    user_info_container: {
        height: 170,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    test_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        height: 50,
    },
    group_btn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        width: 115,
    },
    info_wrapper: {
        marginLeft: 10
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    bio_wrapper: {
        borderColor: 'black',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bio: {
        fontSize: 18
    },
    follow_wrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 160
    },
    posts_container: {
    },
    posts_container_text: {
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 700
    }
})