import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import API_URL from '../api/api_url';
import socket from '../utils/socket';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authState, setAuthState] = useState({
        authToken: null,
        isAuth: false
    })
    let [user, setUser] = useState({
        username: null,
        id: null
    })
    let [loading, setLoading] = useState(true)

    const getAuthData = async () => {
        try {
            const authData = await AsyncStorage.getItem('AuthToken');
            if (authData) {
                const user = jwtDecode(authData)
                setAuthState({
                    authToken: authData,
                    isAuth: true
                })
                setUser({
                    username: user.username,
                    id: user.id
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (user_obj) => {
        const res = await fetch(`${API_URL.AUTH}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user_obj)
        })
        const data = await res.json()
        if (res.status === 200) {
            await AsyncStorage.setItem('RefreshToken', data.refreshToken)
            await AsyncStorage.setItem('AuthToken', data.accessToken)
            const user = jwtDecode(data.accessToken)
            setAuthState({
                authToken: data.accessToken,
                isAuth: true
            })
            setUser({
                username: user.username,
                id: user.id
            })
        } else {
            alert(data.error)
        }
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('AuthToken')
            await AsyncStorage.removeItem('RefreshToken')
            socket.disconnect()
        } catch (error) {
            console.log(error)
        }
        setUser({
            username: null,
            id: null
        })
        setAuthState({
            isAuth: false,
            authToken: null
        })
    }

    const updateToken = async () => {
        let token = await AsyncStorage.getItem('RefreshToken')
        let res = await fetch(`${API_URL.AUTH}/update_token`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + String(token)
            },
            credentials: 'include'
        })
        if (res.status === 200) {
            let data = await res.json()
            await AsyncStorage.setItem('AuthToken', data.accessToken)
            let user = jwtDecode(data.accessToken)
            setAuthState({
                authToken: data.accessToken,
                isAuth: true
            })
            setUser({
                username: user.username,
                id: user.id
            })
        } else {
            logout()
        }
        if (loading) setLoading(false);
    }

    let contextData = {
        authState,
        user,
        handleLogin,
        logout
    }

    useEffect(() => {
        getAuthData()

        if (loading) {
            updateToken()
        }
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (authState.authToken) {
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authState.authToken, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null: children}
        </AuthContext.Provider>
    )
}