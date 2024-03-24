import SafeAreaView from 'react-native-safe-area-view';
import { Image, StyleSheet, Text, TextInput, View, ScrollView, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { useContext, useEffect, useRef, useState } from 'react';
import API_URL from '../../api/api_url';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';
import { Button } from '@rneui/themed';

export default function CreatePostScreen({ navigation }) {
    const { authState, user } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState([]);
    
    const inputRef = useRef(null);
    const focusTextInput = () => {
        inputRef.current.focus();
    }

    const { colors } = useTheme();

    const pickImage = async () => {
        setPhotos([])
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 4
        })
        if (!result.canceled) {
            result.assets.map((item) => {
                setPhotos(prevState => [...prevState, item]);
            })
        }
    }

    const createPost = async () => {
        if (!content && photos.length === 0) return;
 
        let form = new FormData();
        form.append('content', content)
        photos.forEach((photo) => {
            form.append('photos', {
                name: photo.uri.split('/').pop(),
                uri: photo.uri,
                type: mime.getType(photo.uri)
            })
        })
        let res = await fetch(`${API_URL.POST}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + String(authState.authToken),
            },
            body: form
        })
        const data = await res.json()
        if (res.status === 201) {
            setPhotos([])
            setContent('')
            navigation.navigate('Profile', { id: user.id })
        } else {
            setPhotos([])
            setContent('')
            alert(data.error)
        }
    }

    useEffect(() => 
        navigation.addListener('blur', () => {
            setContent('')
            setPhotos([])
        })
    , [navigation])

    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
            <View style={[styles.header, {backgroundColor: colors.icon}]}>
                <Ionicons
                    name='arrow-back'
                    color={'white'}
                    size={33}
                    onPress={() => navigation.goBack()}
                />
                <Text style={[styles.title, {color: 'white'}]}>Create your post</Text>
            </View>

            <Pressable
                style={styles.form}
                onPress={focusTextInput}
            >
                <TextInput
                    placeholder='Enter your content here...'
                    placeholderTextColor={colors.text}
                    multiline={true}
                    value={content}
                    style={{ color: colors.text, fontSize: 18 }}
                    onChangeText={setContent}
                    ref={inputRef}
                />
            </Pressable>

            <View style={styles.imgContainer}>
                <Ionicons
                    name='image'
                    size={30}
                    color={colors.icon_secondary}
                    onPress={pickImage}
                    style={{marginLeft: 40}}
                />
                {photos.length !== 0 &&
                    <ScrollView horizontal={true}>
                        {photos.map((photo, index) => (
                            <Image
                                source={{uri: photo.uri}}
                                resizeMode='contain'
                                key={index}
                                style={{height: 200, width: 200}}
                            />
                        ))}
                    </ScrollView>
                }
            </View>
            <Button title='Create' onPress={createPost} buttonStyle={{marginHorizontal: 20}} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 5,
        paddingTop: 5
    },
    title: {
        flex: 1,
        fontSize: 20,
        textAlign: 'center'
    },
    form: {
        marginLeft: 40,
        marginTop: 10,
        borderLeftWidth: 1,
        borderLeftColor: 'red',
        height: 300,
    },
    imgContainer: {
        marginVertical: 10,
        marginLeft: 10,
        height: 200,
        paddingTop: 5
    }

})