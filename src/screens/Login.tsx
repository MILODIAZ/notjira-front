import { SafeAreaView } from "react-native";
import React from "react";

import LoginForm from "../components/auth/LoginForm";

export default function Login(props) {
	const { navigation } = props;

	return (
		<SafeAreaView>
			<LoginForm navigation={navigation} />
		</SafeAreaView>
	);
}
