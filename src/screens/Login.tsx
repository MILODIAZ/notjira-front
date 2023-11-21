import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LoginForm from "../components/auth/LoginForm";
import { NavigationProp } from "@react-navigation/native";

type LoginProps = {
	navigation: NavigationProp<any>;
};

export default function Login(props: LoginProps) {
	const { navigation } = props;

	return (
		<KeyboardAwareScrollView>
			<LoginForm navigation={navigation} />
		</KeyboardAwareScrollView>
	);
}
