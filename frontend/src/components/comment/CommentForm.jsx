import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CommentForm({createComment}) {
    const [text, setText] = useState('');
    
    const handlePress = () => {
        createComment(text);
        setText('');
    };

    return (
        <Input
            placeholder='Enter your comment'
            value={text}
            onChangeText={setText}
            rightIcon={<Button onPress={handlePress} disabled={!text}><Ionicons name='paper-plane' size={20}/></Button>}
        />
    )
}