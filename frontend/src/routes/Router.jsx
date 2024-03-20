import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack'
import AuthContext from '../context/AuthContext';
import ThemeContext from '../context/ThemeContext';

import * as Linking from 'expo-linking';
import { Text } from '@rneui/base';

const prefix = Linking.createURL('/');
const config = {
    screens: {
        App: {
            screens: {
                Home: 'home',
                Search: 'search'
            }
        },
    }
};

const linking = {
    prefixes: [prefix, 'demo://app'],
    config,
};

export default function Router() {

    const { authState } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    
    const darkTheme = {
        dark: true,
        colors: {
            background: '#14171A',
            text: '#E7E9EA',
            text_secondary: '#657786',
            icon: '#1DA1F2',
            icon_secondary: '#AAB8C2'
        }
    }

    const lightTheme = {
        dark: false,
        colors: {
            background: '#E7E9EA',
            text: '#14171A',
            text_secondary: '#657786',
            icon: '#1DA1F2',
            icon_secondary: '#AAB8C2'
        }
    }

    return (
        <NavigationContainer theme={theme ==='light' ? lightTheme : darkTheme} linking={linking} fallback={<Text>Loading...</Text>}>
            {authState.isAuth ?
                <AppStack />
                :
                <AuthStack />
            }
        </NavigationContainer>
    )
}