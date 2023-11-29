import { SafeAreaView } from "react-native";
import React from "react";

import UserData from "../components/auth/UserData";
import useAuth from "../hooks/useAuth";

import { UserDataProps } from "../components/auth/UserData";

export default function Profile(props: UserDataProps) {
	const { navigation } = props;

	const { auth } = useAuth();

	return (
		<SafeAreaView>
			{auth ? <UserData navigation={navigation} /> : null}
		</SafeAreaView>
	);
}
