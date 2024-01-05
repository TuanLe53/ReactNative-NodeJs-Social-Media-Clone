import { useContext } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { useTheme } from '@react-navigation/native';

export default function SettingScreen({navigation}) {
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { colors } = useTheme();

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <View>
                <Text style={[{color: colors.text, textAlign: 'center', fontSize: 26, paddingBottom: 10}]}>Setting</Text>
            </View>
            <View>
                <Pressable
                    style={[styles.btn_container, {backgroundColor: colors.icon}]}
                    onPress={() => navigation.navigate('Profile', {id: user.id})}>
                    <Text style={[styles.btn_text, {color: colors.text}]}>Profile</Text>
                    <Ionicons name='person-circle' color={'white'} size={35}/>
                </Pressable>
                
                <Pressable
                    style={[styles.btn_container, {backgroundColor: colors.icon}]}
                    onPress={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
                >
                    <Text style={[styles.btn_text, {color: colors.text}]}>Change Theme</Text>
                    <Ionicons
                        name={theme === 'light' ? 'sunny' : 'moon'}
                        color={'white'}
                        size={30}
                    />
                </Pressable>

                <Pressable
                    style={[styles.btn_container, {backgroundColor: colors.icon}]}
                    onPress={logout}>
                    <Text style={[styles.btn_text, {color: colors.text}]}>Log out</Text>
                    <Ionicons name='log-out-outline' color={'white'} size={35}/>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    btn_container: {
        flexDirection: 'row',
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