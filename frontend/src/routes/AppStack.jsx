import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/app/HomeScreen';
import SettingScreen from '../screens/app/SettingScreen';
import SearchScreen from '../screens/app/SearchScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import CreatePostScreen from '../screens/app/CreatePostScreen';
import PostDetailScreen from '../screens/app/PostDetail';
import ChatRoom from '../screens/app/ChatRoom';
import { useTheme } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../utils/notification';
import API_URL from '../api/api_url';
import AuthContext from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={({ route }) => ({
            headerShown: false,
        })}>
            <Stack.Screen name='App' component={TabNavigator} />
            <Stack.Screen name='Profile' component={ProfileScreen} />
            <Stack.Screen name='Post' component={PostDetailScreen} />
            <Stack.Screen name='ChatRoom' component={ChatRoom} />
        </Stack.Navigator>
    )
}

function TabNavigator() {
    const { colors } = useTheme();
    const { authState } = useContext(AuthContext);

    useEffect(() => {

        const assignToken = async (token) => {
            let res = await fetch(`${API_URL.NOTIFICATION}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${String(authState.authToken)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token: token})
            })
            if (res.status !== 201) {
                console.log("Error")
            }
        }

        registerForPushNotificationsAsync().then((token) => assignToken(token))
    },[])

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search-outline' : 'search';
                    } else if (route.name === 'Chat') {
                        iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'Create') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';                        
                    } else if (route.name === 'Setting') {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: '#1DA1F2',
                tabBarInactiveTintColor: '#AAB8C2',
                tabBarStyle: {backgroundColor: colors.background},
                headerShown: false,
            })}>
            
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Search' component={SearchScreen} />
            <Tab.Screen name='Create' component={CreatePostScreen} />
            <Tab.Screen name='Chat' component={ChatScreen} />
            <Tab.Screen name='Setting' component={SettingScreen} />
        </Tab.Navigator>
    )
}