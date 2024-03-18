import SafeAreaView from 'react-native-safe-area-view';
import { useContext } from 'react';
import API_URL from '../../api/api_url';
import Post from '../../components/post/Post';
import { ActivityIndicator, ScrollView } from 'react-native';
import AuthContext from '../../context/AuthContext';
import { useBoundStore } from '../../stores/store';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@rneui/base';

export default function HomeScreen() {
    const { authState } = useContext(AuthContext);
    
    const posts = useBoundStore((state) => state.posts);
    const setPosts = useBoundStore((state) => state.setPosts);

    const fetchPosts = async () => {
        const res = await fetch(`${API_URL.POST}`, {
            headers: { 'Authorization': 'Bearer ' + String(authState.authToken) }
        })
        const data = await res.json()
        setPosts(data)
        return data
    }

    const { isError, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) return <ActivityIndicator />
    if (isError) return <Text>Error retrieving posts</Text>

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <ScrollView>          
            {
                posts.map((post) => (
                    <Post data={post} key={post.id} />
                )) 
            }
            </ScrollView>
        </SafeAreaView>
    )
}