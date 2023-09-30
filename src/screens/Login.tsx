import { SafeAreaView } from "react-native";
import React from "react";

import LoginForm from "../components/auth/LoginForm";
import { NavigationProp } from "@react-navigation/native";

type LoginProps = {
	navigation: NavigationProp<any>;
};

export default function Login(props:LoginProps) {
	const { navigation } = props;	

	return (
		<SafeAreaView>
			<LoginForm navigation={navigation} />
		</SafeAreaView>
	);
}
