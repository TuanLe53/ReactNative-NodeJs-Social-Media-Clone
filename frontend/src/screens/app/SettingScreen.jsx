import { useContext } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';

export default function SettingScreen({navigation}) {
    const {logout, user} = useContext(AuthContext)

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <Pressable
                style={styles.btn_container}
                onPress={() => navigation.navigate('Profile', {id: user.id})}>
                <Text style={styles.btn_text}>Profile</Text>
                <Ionicons name='person-circle' color={'white'} size={35}/>
            </Pressable>
            <Pressable
                style={styles.btn_container}
                onPress={logout}>
                <Text style={styles.btn_text}>Log out</Text>
                <Ionicons name='log-out-outline' color={'white'} size={35}/>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    btn_container: {
        flexDirection: 'row',
        backgroundColor: 'pink',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 9,
        padding: 10
    },
    btn_text: {
        fontSize: 18
    }
});