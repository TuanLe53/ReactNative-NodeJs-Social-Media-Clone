import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Router from './src/routes/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import socket from './src/utils/socket';
import * as Notifications from 'expo-notifications';


const queryClient = new QueryClient();

export default function App() {
	const [isConnected, setIsConnected] = useState(false);

	const responseListener = useRef();

	useEffect(() => {
		socket.connect();
		socket.io.on('open', () => setIsConnected(true));
		socket.io.on('close', () => setIsConnected(false));

		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			console.log(response)
		})

		return () => {
			Notifications.removeNotificationSubscription(responseListener.current)
		}
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>
					<SafeAreaProvider>
						<Router />
					</SafeAreaProvider>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
);
}