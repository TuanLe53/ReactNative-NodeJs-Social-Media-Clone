import { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack'
import AuthContext from '../context/AuthContext';

export default function Router() {
    const { authState } = useContext(AuthContext);
    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: '#14171A',
            
            text: '#E7E9EA',
            text_secondary: '#657786',
            icon: '#1DA1F2',
            icon_secondary: '#AAB8C2'
        },
    };

    return (
        <NavigationContainer theme={theme}>
            {authState.isAuth ?
                <AppStack />
                :
                <AuthStack />
            }
        </NavigationContainer>
    )
}