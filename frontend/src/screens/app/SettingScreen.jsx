import { useContext } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../../context/AuthContext';
import ThemeContext from '../../context/ThemeContext';
import { useTheme } from '@react-navigation/native';

function SettingBtn({ func, text, iconName }) {
    const {colors} = useTheme();

    return (
        <Pressable
            style={[styles.btn_container, { backgroundColor: colors.icon }]}
            onPress={func}
        >
            <Text style={[styles.btn_text, { color: colors.text }]}>{text}</Text>
            <Ionicons name={iconName} color={'white'} size={35} />
        </Pressable>
    )
}

export default function SettingScreen({navigation}) {
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { colors } = useTheme();

    const goToProfile = () => navigation.navigate('Profile', { id: user.id });
    const changeTheme = () => toggleTheme(theme === 'light' ? 'dark' : 'light')

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
            <View>
                <Text style={[{color: colors.text}, styles.title]}>Settings</Text>
            </View>
            <View>
                <SettingBtn
                    func={goToProfile}
                    text='Profile'
                    iconName='person-circle'
                />
                
                <SettingBtn
                    func={changeTheme}
                    text='Change Theme'
                    iconName={theme === 'light' ? 'sunny' : 'moon'}
                />

                <SettingBtn
                    func={logout}
                    text='Log out'
                    iconName='log-out-outline'
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 26,
        paddingBottom: 10    
    },
    btn_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 5,
        borderWidth: 2,
        borderRadius: 12,
        padding: 10
    },
    btn_text: {
        fontSize: 18
    }
});