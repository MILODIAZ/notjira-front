import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LoginForm from "../components/auth/LoginForm";
import { LoginProps } from "../components/auth/LoginForm";

export default function Login(props: LoginProps) {
	const { navigation } = props;

	return (
		<KeyboardAwareScrollView>
			<LoginForm navigation={navigation} />
		</KeyboardAwareScrollView>
	);
}
