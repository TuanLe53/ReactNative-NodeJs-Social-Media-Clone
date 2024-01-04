import { useContext, useState } from 'react';
import { Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../context/AuthContext';
import API_URL from '../api/api_url';
import { useTheme } from '@react-navigation/native';

export default function LikeBtn(props) {
    const { authState } = useContext(AuthContext);
    const { data } = props;
    const [isLike, setIsLike] = useState(data.is_like);

    const { colors } = useTheme();
    
    const handleLike = async () => {
        const res = await fetch(`${API_URL.POST}/${data.post_id}/like`, {
            method: isLike ? 'DELETE' : 'POST',
            headers: {
                'Authorization': `Bearer ${String(authState.authToken)}`
            }
        });
        const result = res.json();
        if (res.status === 500) {
            alert(result.error)
            return;
        }
        setIsLike(!isLike)
    }

    return (
        <Pressable onPress={handleLike}>
            {isLike ?
            <Ionicons name='heart' color={'red'} size={24} />
            :    
            <Ionicons name='heart-outline' color={colors.icon_secondary} size={24} />
            }
        </Pressable>
    )
}