import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack'
import AuthContext from '../context/AuthContext';
import { useColorScheme } from 'react-native';
import ThemeContext from '../context/ThemeContext';

export default function Router() {
    const { authState } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    
    const darkTheme = {
        colors: {
            background: '#14171A',
            text: '#E7E9EA',
            text_secondary: '#657786',
            icon: '#1DA1F2',
            icon_secondary: '#AAB8C2'
        }
    }

    const lightTheme = {
        colors: {
            background: 'white',
            text: '#E7E9EA',
            text_secondary: '#657786',
            icon: '#1DA1F2',
            icon_secondary: '#AAB8C2'
        }
    }

    return (
        <NavigationContainer theme={theme ==='light' ? lightTheme : darkTheme}>
            {authState.isAuth ?
                <AppStack />
                :
                <AuthStack />
            }
        </NavigationContainer>
    )
}