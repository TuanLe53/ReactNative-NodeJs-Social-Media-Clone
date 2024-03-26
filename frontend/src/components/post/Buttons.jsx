import { Button, Dialog, Text } from '@rneui/base';
import { useContext, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';
import { useBoundStore } from '../../stores/store';
import { useRoute, useTheme } from '@react-navigation/native';
import API_URL from '../../api/api_url';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function DropDownBtns({data}) {
    const { user, authState } = useContext(AuthContext);
    
    const { colors } = useTheme();

    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const removePost = useBoundStore((state) => state.removePost);
    const removeUserPost = useBoundStore((state) => state.removeUserPost);

    const route = useRoute();

    const toggleOpen = () => {
        console.log('Toggle open')
        setIsOpen(!isOpen)
    };

    const handleDelete = async () => {
        let res = await fetch(`${API_URL.POST}/${data.id}`, {
            headers: { 'Authorization': `Bearer ${authState.authToken}` },
            method: 'DELETE'
        });

        if (res.status === 200) {
            removePost(data.id)
            removeUserPost(data.id)
            setIsDeleteModalOpen(false)
        }
    }

    const renderDropDown = () => {
        if (isOpen) {
            return (
                <View
                    style={styles.dropdown}
                >
                    <Button>
                        Report
                        <Ionicons name='alert-circle-outline' />
                    </Button>

                    {(data.created_by === user.id && route.name === 'Profile') &&
                    <Button
                        onPress={() => setIsDeleteModalOpen(!isDeleteModalOpen)}        
                    >
                        Delete
                        <Ionicons name='trash-outline'/>
                    </Button>
                    }
                    <Dialog
                    isVisible={isDeleteModalOpen}
                    onBackdropPress={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                    >
                        <Dialog.Title title='Delete post'/>
                        <Text>Are you sure?</Text>
                        <Dialog.Actions>
                            <Dialog.Button
                                title='DELETE'
                                onPress={handleDelete}
                            />
                            <Dialog.Button
                                title='CANCEL'
                                onPress={() => setIsOpen(!isOpen)}
                            />
                        </Dialog.Actions>
                    </Dialog>
                </View>
            )
        }
    }


    return (
        <TouchableOpacity
            onPress={toggleOpen}
            style={styles.container}
        >
            <Ionicons
                name='ellipsis-horizontal'
                size={24}
                color={colors.icon_secondary}
            />
            {renderDropDown()}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        zIndex: 1
    },
    dropdown: {
        width: 100,
        position: 'absolute',
        backgroundColor: 'blue',
        top: 30,
        right: 0
    }
})