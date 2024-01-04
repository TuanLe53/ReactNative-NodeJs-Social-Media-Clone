import { Dialog, Input } from '@rneui/themed';
import { useState, useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import API_URL from '../../api/api_url';
import AuthContext from '../../context/AuthContext';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function EditBio(props) {
    const { authState } = useContext(AuthContext);
    const [bio, setBio] = useState(props.bio);
    const [isOpen, setIsOpen] = useState(false);
    const [newBio, setNewBio] = useState('');

    const { colors } = useTheme();
    
    const changeBio = async () => {
        const res = await fetch(`${API_URL.PROFILE}/bio`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + String(authState.authToken),
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ newBio })
        })
        const data = await res.json()
        if (res.status === 200) {
            setBio(data.bio)
            setIsOpen(false)
            setNewBio('')
        } else {
            alert(data.error)
        }
    }
    
    return (
        <View style={styles.container}>
            <Text style={[styles.bio, {color: colors.text}]}>{bio ? bio : ''}</Text>
            {props.isOwner &&
                <Pressable
                    style={styles.btn}
                    onPress={() => setIsOpen(!isOpen)}>
                    <Ionicons name='pencil' size={20} color={colors.text}/>
                </Pressable>
            }
            <Dialog
                isVisible={isOpen}
                onBackdropPress={() => setIsOpen(!isOpen)}
                overlayStyle={{alignItems: 'center', backgroundColor: colors.background}}
            >
                <Dialog.Title title='Edit your bio' titleStyle={{color: colors.text}} />
                    <Input
                        placeholder={bio ? bio : 'Enter your bio'}
                        value={newBio}
                        onChangeText={setNewBio}
                        rightIcon={<Ionicons name='pencil' size={20} color={colors.text} />}
                        inputStyle={{color: colors.text}}
                        multiline={true}
                    />
                <Dialog.Button title='Edit' onPress={changeBio}/>
            </Dialog>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bio: {
        fontSize: 18
    },
    btn: {
        marginLeft: 5,
    }
})