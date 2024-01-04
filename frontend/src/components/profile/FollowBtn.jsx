import { Pressable, View, Text, StyleSheet } from 'react-native';
import API_URL from '../../api/api_url';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function FollowBtn(props) {
    const { authState } = useContext(AuthContext);
    const { profile_id } = props;
    const [isFollow, setIsFollow] = useState(false);

    const { colors } = useTheme();

    const handleFollow = async () => {
        const res = await fetch(`${API_URL.PROFILE}/follow/${profile_id}`, {
            method: (isFollow ? 'DELETE' : 'POST'),
            headers: {
                'Authorization': 'Bearer ' + String(authState.authToken)
            },
            credentials: 'include'
        })
        const data = res.json()
        if (res.status === 201) {
            setIsFollow(true)
        } else if (res.status === 200) {
            setIsFollow(false)
        }
         else {
            alert(data.error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${API_URL.PROFILE}/follow/${profile_id}`, {
                headers: {'Authorization': `Bearer ${String(authState.authToken)}`}
            })
            if (res.status === 200) setIsFollow(true);
        }

        fetchData()
    },[])

    return (
        <Pressable style={[styles.container, {backgroundColor: colors.icon}]} onPress={handleFollow}>
            <Text style={{color: colors.text}}>{isFollow ? 'Unfollow' : 'Follow'}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        height: 30,
        width: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})