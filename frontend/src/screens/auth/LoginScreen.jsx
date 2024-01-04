import { Pressable, StyleSheet, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import SafeAreaView from 'react-native-safe-area-view';
import isEmail from 'validator/lib/isEmail'
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
    const { handleLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { colors } = useTheme();

    const checkInput = () => {
        if (!email.trim()) {
            alert('Please enter your email')
            return true;
        }
        if (!password.trim()) {
            alert('Please enter your password')
            return true;
        }
    }

    const onLogin = async () => {
        if (checkInput()) return;
        if (!isEmail(email)) {
            alert('Please enter correct email')
            return;
        }
        handleLogin({
            email,
            password
        })
    }


    return (
        <SafeAreaView forceInset={{top: 'always'}}>
            <Text style={[styles.title, {color: colors.text}]}>Login</Text>
            <Text style={[{color: colors.text, paddingLeft: 10}]}>Email</Text>
            <Input placeholder='Enter your email' value={email} onChangeText={setEmail} inputStyle={[{color: colors.text}]}/>
            <Text style={[{color: colors.text, paddingLeft: 10}]}>Password</Text>
            <Input placeholder='Enter your password' value={password} onChangeText={setPassword} secureTextEntry={true}  inputStyle={[{color: colors.text}]}/>
            <Button title='Login' onPress={onLogin} />
            <Text style={[{color: colors.text}]}>Don't have account yet? <Pressable onPress={()=>navigation.navigate('Register')}><Text style={{color:colors.icon}}>Register</Text></Pressable></Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center'
    }
});