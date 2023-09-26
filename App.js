import "react-native-gesture-handler";
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from "./src/navigation/NavigationStack";
import NavigationTab from "./src/navigation/NavigationTab";
import NavigationDrawer from "./src/navigation/NavigationDrawer";
import Navigation from "./src/navigation/Navigation";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
	return (
		<NavigationContainer>
			<AuthProvider>
				{/* <NavigationStack /> */}
				{/* <NavigationTab /> */}
				{/* <NavigationDrawer /> */}
				<Navigation />
			</AuthProvider>
		</NavigationContainer>

	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
