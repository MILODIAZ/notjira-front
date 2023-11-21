import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import RegisterForm from "../components/auth/RegisterForm";
import { NavigationProp } from "@react-navigation/native";

type LoginProps = {
	navigation: NavigationProp<any>;
};

export default function Register(props: LoginProps) {
	const { navigation } = props;

	return (
		<KeyboardAwareScrollView>
			<RegisterForm navigation={navigation} />
		</KeyboardAwareScrollView>
	);
}
