import { Pressable, StyleSheet, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import SafeAreaView from 'react-native-safe-area-view';
import isEmail from 'validator/lib/isEmail'
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from '@react-navigation/native';
import { Dialog } from '@rneui/base';
import API_URL from '../../api/api_url';

export default function LoginScreen({ navigation }) {
    const { handleLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [resetEmail, setResetEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);

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

    const handleReset = async () => {
        if (!resetEmail) {
            alert('Please enter your emails');
            return;
        }

        const res = await fetch(`${API_URL.AUTH}/reset_password_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: resetEmail})
        })
        const data = await res.json()
        if (res.status === 200) {
            setIsOpen(false)
            setResetEmail('')
            alert('Check your email for reset password link')
        } else {
            alert(data.error)
        }
    }

    return (
        <SafeAreaView forceInset={{top: 'always'}}>
            <Text style={[styles.title, {color: colors.text}]}>Login</Text>
            <Text style={[{color: colors.text, paddingLeft: 10}]}>Email</Text>
            <Input placeholder='Enter your email' value={email} onChangeText={setEmail} inputStyle={[{color: colors.text}]}/>
            <Text style={[{color: colors.text, paddingLeft: 10}]}>Password</Text>
            <Input placeholder='Enter your password' value={password} onChangeText={setPassword} secureTextEntry={true}  inputStyle={[{color: colors.text}]}/>
            <Button title='Login' onPress={onLogin} />
            <Text style={[{ color: colors.text }]}>Don't have account yet? <Pressable onPress={() => navigation.navigate('Register')}><Text style={{ color: colors.icon }}>Register</Text></Pressable></Text>
            <Pressable onPress={() => setIsOpen(!isOpen)}><Text>Forgot password?</Text></Pressable>
            <Dialog isVisible={isOpen}>
                <Dialog.Title title="Enter your account's email "/> 
                <Input value={resetEmail} onChangeText={setResetEmail} />
                <Dialog.Actions>
                    <Dialog.Button
                        title='Confirm'
                        onPress={handleReset}
                    />
                    <Dialog.Button
                        title='Cancel'
                        onPress={() => setIsOpen(!isOpen)}
                    />
                </Dialog.Actions>
            </Dialog>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        textAlign: 'center'
    }
});