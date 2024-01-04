import { Avatar, Badge, Dialog } from '@rneui/themed';
import { useContext, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';
import API_URL from '../../api/api_url';
import { useTheme } from '@react-navigation/native';

export default function ProfileAvatar(props) {
    const { authState } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(props.avatar);
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState(null);

    const { colors } = useTheme();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        })

        if (!result.canceled) {
            setPhoto(result.assets[0].uri)
        }
    }

    const uploadAvatar = async () => {
        const uploadedResult = await FileSystem.uploadAsync(
            `${API_URL.PROFILE}/avatar`,
            photo,
            {
                httpMethod: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + String(authState.authToken)
                },
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'avatar'
            }
        )
        if (uploadedResult.status === 200) {
            const data = JSON.parse(uploadedResult.body)
            setAvatar(data.url)
            setIsOpen(false)
            setPhoto(null)
        } else {
            alert('Something went wrong')
        }
    }


    return (
        <View>
            <Avatar
                source={avatar ? {uri: avatar} : require('../../../assets/icon.png')}
                rounded
                size={100}
                containerStyle={styles.avatar}
            />
            {props.isOwner &&
                <Badge value={<Ionicons name='pencil' size={20} />}
                containerStyle={styles.edit_btn_wrapper}
                badgeStyle={styles.edit_btn}
                onPress={() => setIsOpen(!isOpen)}
                />
            }
            <Dialog
                isVisible={isOpen}
                onBackdropPress={() => {
                    setIsOpen(!isOpen)
                    setPhoto(null)
                }}
                overlayStyle={[styles.dialog_container, {backgroundColor: colors.background}]}
            >
                <Dialog.Title title='Edit your avatar' titleStyle={{color: colors.text}} />
                {photo &&
                    <Avatar source={{uri: photo}} size={150} rounded/>
                }
                <Pressable
                    onPress={pickImage}
                    style={styles.pick_img_btn}
                >
                    <Ionicons name='image' size={30} />
                </Pressable>
                <Dialog.Button title='Update'
                    disabled={photo ? false : true}
                    onPress={uploadAvatar}
                />
            </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        position: 'absolute',
        top: -50,
        borderWidth: 3
    },
    edit_btn_wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 63
    },
    edit_btn: {
        backgroundColor: 'rgba(29, 161, 242, 0.5)',
        width: 25,
        height: 25,
        borderColor: 'rgb(29, 161, 242)',
        borderWidth: 1,
    },
    dialog_container: {
        display: 'flex',
        alignItems: 'center',
    },
    pick_img_btn: {
        backgroundColor: 'gray',
        width: 50,
        marginTop: 5,
        display: 'flex',
        alignItems: 'center'
    }
})