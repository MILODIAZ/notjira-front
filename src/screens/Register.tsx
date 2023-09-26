import { SafeAreaView, KeyboardAvoidingView } from "react-native";
import React from "react";

import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
	return (
		<SafeAreaView>
			<RegisterForm />
		</SafeAreaView>
	);
}
