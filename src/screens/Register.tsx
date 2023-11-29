import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import RegisterForm from "../components/auth/RegisterForm";

import { RegisterFormProps } from "../components/auth/RegisterForm";

export default function Register(props: RegisterFormProps) {
	const { navigation } = props;

	return (
		<KeyboardAwareScrollView>
			<RegisterForm navigation={navigation} />
		</KeyboardAwareScrollView>
	);
}
