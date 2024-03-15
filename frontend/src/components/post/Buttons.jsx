import { Button, Dialog, Text } from '@rneui/base';
import { useContext, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';

import { useRoute } from '@react-navigation/native';


export default function Buttons(props) {
    const { user } = useContext(AuthContext);
    const { data } = props;
    const [isOpen, setIsOpen] = useState(false);

    const route = useRoute();


    const handleDelete = async () => {
        console.log("Hehehe boy")
        // let res = await fetch();

        // if (res.status === 200) {
            
        // }
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