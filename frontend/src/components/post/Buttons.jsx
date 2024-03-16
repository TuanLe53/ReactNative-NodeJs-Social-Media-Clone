import { Button, Dialog, Text } from '@rneui/base';
import { useContext, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';

import { useRoute } from '@react-navigation/native';
import API_URL from '../../api/api_url';


export default function Buttons(props) {
    const { user, authState } = useContext(AuthContext);
    const { data } = props;
    const [isOpen, setIsOpen] = useState(false);

    const route = useRoute();


    const handleDelete = async () => {
        let res = await fetch(`${API_URL.POST}/${data.id}`, {
            headers: { 'Authorization': `Bearer ${authState.authToken}` },
            method: 'DELETE'
        });

        if (res.status === 200) {
            setIsOpen(false)
        }
    }

    return (
        <>
            <Button>
                Report
                <Ionicons name='alert-circle-outline' />
            </Button>
            {(data.created_by === user.id && route.name === 'Profile') &&
            <Button onPress={() => setIsOpen(!isOpen)}>
                Delete
                <Ionicons name='trash-outline'/>
            </Button>
            }
            <Dialog
                isVisible={isOpen}
                onBackdropPress={() => setIsOpen(!isOpen)}
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
        </>
    )
}