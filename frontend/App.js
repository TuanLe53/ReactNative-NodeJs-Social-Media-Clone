import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import Router from './src/routes/Router';

export default function App() {

	return (
		<AuthProvider>
			<SafeAreaProvider>
				<Router />
			</SafeAreaProvider>
		</AuthProvider>
);
}