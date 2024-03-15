import { Button } from '@rneui/base';
import { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';

export default function Buttons(props) {
    const { user } = useContext(AuthContext);
    const { data } = props;

    return (
        <>
            <Button>
                Report
                <Ionicons name='alert-circle-outline' />
            </Button>

            {data.created_by === user.id &&
            <Button>
                Delete
                <Ionicons name='trash-outline'/>
            </Button>
            }
        </>
    )
}