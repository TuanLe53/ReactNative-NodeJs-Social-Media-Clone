import { useContext } from "react";
import SafeAreaView from 'react-native-safe-area-view';
import Post from "../../components/post/Post";
import API_URL from "../../api/api_url";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import AuthContext from "../../context/AuthContext";
import Comments from "../../components/comment/Comments";
import { useQuery } from "@tanstack/react-query";

export default function PostDetailScreen({ route }) {
    const { authState } = useContext(AuthContext);
    const { id } = route.params;

    const fetchPost = async () => {
        const res = await fetch(`${API_URL.POST}/${id}`, {
            headers:{'Authorization': `Bearer ${String(authState.authToken)}`}
        })
        const data = await res.json()
        return data
    }
    
    const { isError, isLoading, data } = useQuery({
        queryKey: ['post'],
        queryFn: fetchPost,
    })

    if (isLoading) return <ActivityIndicator />
    if (isError) return <Text>Error</Text>
    
    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>   
            <ScrollView>
                <Post data={data} />
                <Comments post_id={id} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});