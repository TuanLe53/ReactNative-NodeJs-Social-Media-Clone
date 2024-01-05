import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Router from './src/routes/Router';

export default function App() {

	return (
		<AuthProvider>
			<ThemeProvider>
				<SafeAreaProvider>
					<Router />
				</SafeAreaProvider>
			</ThemeProvider>
		</AuthProvider>
);
}