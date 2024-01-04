import SafeAreaView from 'react-native-safe-area-view';
import { useContext, useEffect, useState } from 'react';
import API_URL from '../../api/api_url';
import Post from '../../components/post/Post';
import { ActivityIndicator, ScrollView } from 'react-native';
import AuthContext from '../../context/AuthContext';
import socket from '../../utils/socket';

export default function HomeScreen() {
    const { authState } = useContext(AuthContext);
    const [posts, setPosts] = useState([])
    
    const [isConnected, setIsConnected] = useState(false);

    
    useEffect(() => {
        socket.connect()
        socket.io.on('open', () => setIsConnected(true));
        socket.io.on('close', () => setIsConnected(false));
        
        const fetchPosts = async () => {
            const res = await fetch(`${API_URL.POST}`, {
                headers: {'Authorization': 'Bearer ' + String(authState.authToken)}
            })
            const data = await res.json()
            setPosts(data)
        }

        fetchPosts()
    }, [])

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <ScrollView>          
            {posts ?
                posts.map((post) => (
                    <Post data={post} key={post.id} />
                ))
            :
            <ActivityIndicator />    
            }
            </ScrollView>
        </SafeAreaView>
    )
}