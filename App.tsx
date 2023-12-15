import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/Navigation";
import { AuthProvider } from "./src/context/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function App() {
	return (
		<NavigationContainer>
			<AuthProvider>
				<PaperProvider>
					<Navigation />
				</PaperProvider>
			</AuthProvider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
