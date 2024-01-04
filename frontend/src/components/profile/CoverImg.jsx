import { Badge, Dialog } from '@rneui/themed';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import API_URL from '../../api/api_url';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function CoverImg(props) {
    const { authState } = useContext(AuthContext);
    const [coverPhoto, setCoverPhoto] = useState(props.coverPhoto)
    const [photo, setPhoto] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    
    const { colors } = useTheme();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [3,2]
        })

        if (!result.canceled) {
            setPhoto(result.assets[0].uri)
        }
    }

    const updateImage = async () => {
        const uploadedResult = await FileSystem.uploadAsync(
            `${API_URL.PROFILE}/cover`,
            photo,
            {
                httpMethod: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + String(authState.authToken)
                },
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'cover',
            }
        )
        if (uploadedResult.status === 200) {
            const data = JSON.parse(uploadedResult.body)
            setCoverPhoto(data.url)
            setIsOpen(false)
            setPhoto(null)
        } else {
            alert('Something went wrong')
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={coverPhoto ? {uri: coverPhoto} : require('../../../assets/icon.png')}
                resizeMode='stretch'
                style={styles.img}
            />
            {props.isOwner &&             
                <Badge
                    value={<Ionicons name='pencil' size={25} />}
                    containerStyle={styles.edit_btn_wrapper}
                    badgeStyle={styles.edit_btn}
                    onPress={() => setIsOpen(!isOpen)}
                />
            }
            <Dialog
                isVisible={isOpen}
                onBackdropPress={() => setIsOpen(!isOpen)}
                overlayStyle={{backgroundColor: colors.background, alignItems: 'center'}}
            >
                <Dialog.Title title='Edit your cover photo' titleStyle={{color: colors.text}} />
                <Image
                    source={{ uri: photo }}
                    resizeMode='stretch'
                    style={{width: 250, height:165}}
                />
                <Pressable onPress={pickImage} style={styles.pick_image_btn}>
                    <Ionicons name='image' size={30} />
                </Pressable>
                <Dialog.Button title='Update'
                    disabled={photo ? false : true}
                    onPress={updateImage}
                />
            </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 220
    },
    img: {
        height: '100%',
        width: '100%'
    },
    edit_btn_wrapper: {
        position: 'absolute',
        right: 10,
    },
    edit_btn: {
        backgroundColor: 'rgba(29, 161, 242, 0.5)',
        width: 27,
        height: 27,
        borderColor: 'rgb(29, 161, 242)',
        borderWidth: 1,
    },
    pick_image_btn: {
        backgroundColor: 'gray',
        width: 50,
        marginTop: 5,
        display: 'flex',
        alignItems: 'center',
    }
})