import { Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen(props) {
	const { navigation } = props;

	const goToPage = (pageName) => {
		navigation.navigate(pageName);
	};

	return (
		<SafeAreaView>
			<Text>SettingsScreen</Text>
			<Button
				title="Go to Home"
				onPress={() => goToPage("Home")}
			></Button>
		</SafeAreaView>
	);
}
