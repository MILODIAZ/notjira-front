import { SafeAreaView, KeyboardAvoidingView } from "react-native";
import React from "react";

import RegisterForm from "../components/auth/RegisterForm";
import { NavigationProp } from "@react-navigation/native";

type LoginProps = {
	navigation: NavigationProp<any>;
};

export default function Register(props:LoginProps) {
	const { navigation } = props;

	return (
		<SafeAreaView>
			<RegisterForm navigation={navigation} />
		</SafeAreaView>
	);
}
