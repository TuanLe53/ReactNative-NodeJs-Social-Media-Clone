import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Router from './src/routes/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {

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