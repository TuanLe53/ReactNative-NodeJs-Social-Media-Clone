import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Router from './src/routes/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import socket from './src/utils/socket';

const queryClient = new QueryClient();

export default function App() {
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		socket.connect();
		socket.io.on('open', () => setIsConnected(true));
		socket.io.on('close', () => setIsConnected(false));
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