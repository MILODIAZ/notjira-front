import "react-native-gesture-handler";
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NavigationStack from "./src/navigation/NavigationStack";
import NavigationTab from "./src/navigation/NavigationTab";
import NavigationDrawer from "./src/navigation/NavigationDrawer";
import Navigation from "./src/navigation/Navigation";

export default function App() {
	return (
		<NavigationContainer>
			{/* <NavigationStack /> */}
			{/* <NavigationTab /> */}
			{/* <NavigationDrawer /> */}
			<Navigation />
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