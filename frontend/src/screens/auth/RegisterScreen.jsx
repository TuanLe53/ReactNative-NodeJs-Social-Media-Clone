import SafeAreaView from 'react-native-safe-area-view';
import { Text } from '@rneui/base';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import API_URL from '../../api/api_url';
import { useTheme } from '@react-navigation/native';
import { styles } from './LoginScreen';

export default function RegisterScreen({navigation}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const { colors } = useTheme();

    const checkInput = () => {
        if (!username.trim()) {
            alert('Please enter username')
            return true;
        }
        if (!email.trim()) {
            alert('Please enter your email')
            return true;
        }
        if (!password1.trim()) {
            alert('Please enter your password')
            return true;
        }
        if (!password2.trim()) {
            alert('Please confirm your password')
            return true;
        }
    }
    
    const handleRegister = async () => {
        if (checkInput()) return;
        if (!isEmail(email)) {
            alert('Please enter correct email')
            return;
        }
        if (password1 !== password2) {
            alert("Password doesn't match")
            return;
        }

        const user = {
            username,
            email,
            password: password1
        }

        const res = await fetch(`${API_URL.AUTH}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })

        const data = await res.json()
        if (res.status === 201) {
            alert(data.message)
            navigation.navigate('Login')
        } else {
            alert(data.error)
        }
    }
    return (
        <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
            <Text style={[{ color: colors.text}, styles.title]}>Register</Text>
            
            <Text style={[{color: colors.text}, styles.label]}>Username</Text>
            <Input
                placeholder='Enter your username'
                value={username}
                onChangeText={setUsername}
                inputStyle={{ color: colors.text }}
            />
            
            <Text style={[{ color: colors.text }, styles.label]}>Email</Text>
            <Input
                placeholder='Enter your email'
                value={email}
                onChangeText={setEmail}
                inputStyle={{ color: colors.text }}
            />
            
            <Text style={[{ color: colors.text }, styles.label]}>Password</Text>
            <Input
                placeholder='Enter your password'
                value={password1}
                onChangeText={setPassword1}
                secureTextEntry={true}
                inputStyle={{ color: colors.text }}
            />
            
            <Text style={[{ color: colors.text }, styles.label]}>Confirm password</Text>
            <Input
                placeholder='Confirm your password'
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry={true}
                inputStyle={{ color: colors.text }}
            />
        
            <Button
                title={'Register'}
                onPress={handleRegister}
                buttonStyle={{marginHorizontal: 10}}
            />
        
        </SafeAreaView>
    )
}