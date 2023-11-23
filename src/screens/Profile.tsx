import { SafeAreaView } from "react-native";
import React from "react";

import UserData from "../components/auth/UserData";
import useAuth from "../hooks/useAuth";
import { NavigationProp } from "@react-navigation/native";
import { Button } from "react-native";

type ProfileProps = {
	navigation: NavigationProp<any>;
};

export default function Profile(props: ProfileProps) {
	const { navigation } = props;

	const { auth } = useAuth();

	return (
		<SafeAreaView>
			{auth ? <UserData navigation={navigation} /> : null}
		</SafeAreaView>
	);
}
