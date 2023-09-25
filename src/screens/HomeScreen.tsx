import { Text, Button, SafeAreaView } from "react-native";
import React from "react";

export default function HomeScreen(props) {
	const { navigation } = props;

	const goToPage = (pageName) => {
		navigation.navigate(pageName);
	};

	return (
		<SafeAreaView>
			<Text>HomeScreen</Text>
			<Button
				title="Go to Settings"
				onPress={() => goToPage("Settings")}
			></Button>
		</SafeAreaView>
	);
}
