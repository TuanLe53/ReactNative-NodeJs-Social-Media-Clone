import { Text } from '@rneui/base';
import { Button, Input } from '@rneui/themed';
import { useState } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import API_URL from '../../api/api_url';
import { styles } from './LoginScreen';
import { useTheme } from '@react-navigation/native';

export default function ResetPasswordScreen({navigation, route}) {
    const { token, id } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [error1, setError1] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error2, setError2] = useState('');

    const { colors } = useTheme();

    const handleClick = async () => {
        const body = {
            user_id: id,
            token,
            password: newPassword
        }

        if (newPassword.length < 8) {
            setError1('The new password provided is not long enough')
            return;
        } else {
            setError1('');
        }

        if (newPassword !== confirmPassword) {
            setError2("Password didn't match")
            return;
        } else {
            setError2('');
        }

        const res = await fetch(`${API_URL.AUTH}/reset_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (res.status === 200) {
            navigation.navigate('Login')
        } else {
            alert(data.error)
        }
    } 

    return (
        <SafeAreaView forceInset={{top: 'always'}} style={styles.container}>
            <Text style={[{color: colors.text, marginBottom: 10}, styles.title]}>Reset Password</Text>

            <Text style={[{color: colors.text}, styles.label]}>Enter your new password:</Text>
            <Input
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
            />
            {error1 && <Text>{error1}</Text>}

            <Text style={[{color: colors.text}, styles.label]}>Confirm your password:</Text>
            <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />
            {error2 && <Text>{error2}</Text>}

            <Button
                title={'Confirm'}
                onPress={handleClick}
                disabled={newPassword ? false : true}
                buttonStyle={{marginHorizontal: 10}}
            />
        </SafeAreaView>
    )
}