import SafeAreaView from 'react-native-safe-area-view';
import { Button, Image, StyleSheet, Text, TextInput, View, ScrollView, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { useContext, useEffect, useState } from 'react';
import API_URL from '../../api/api_url';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function CreatePostScreen({ navigation }) {
    const { authState, user } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState([]);
    
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
        <SafeAreaView forceInset={{ top: 'always' }}>
            <View style={[styles.header, {backgroundColor: colors.icon}]}>
                <Ionicons
                    name='arrow-back'
                    size={34}
                    onPress={() => navigation.goBack()}
                />
                <Text style={[styles.title, {color: colors.text}]}>Create your post</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    placeholder='Enter your content'
                    placeholderTextColor={colors.text}
                    multiline={true}
                    value={content}
                    style={{ color: colors.text }}
                    onChangeText={setContent}
                />
            </View>
            <View>
                {photos.length !== 0 &&
                    <ScrollView horizontal={true} style={{marginLeft: 40}}>
                        {photos.map((photo, index) => (
                            <Image
                                source={{uri: photo.uri}}
                                resizeMode='contain'
                                key={index}
                                style={{height: 100, width: 100}}
                            />
                        ))}
                    </ScrollView>
                }
                <Ionicons
                    name='image'
                    size={30}
                    color={colors.icon_secondary}
                    onPress={pickImage}
                    style={{marginLeft: 40}}
                />
            </View>
            <Button title='Create' onPress={createPost} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
        maxHeight: 200
    },
    img_container: {
        backgroundColor: 'red'
    }
})