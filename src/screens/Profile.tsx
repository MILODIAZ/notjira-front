import { SafeAreaView, Text } from "react-native";
import React from "react";

import UserData from "../components/auth/UserData";
import useAuth from "../hooks/useAuth";

export default function Profile(props) {
	const { navigation } = props;

	const { auth } = useAuth();

	return (
		<SafeAreaView>
			{auth ? <UserData navigation={navigation} /> : null}
		</SafeAreaView>
	);
}
