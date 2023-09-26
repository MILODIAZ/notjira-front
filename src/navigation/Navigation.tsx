import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignInTabNavigation from "./SignInTabNavigation";
import AppNavigation from "./AppNavigation";
import useAuth from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

export default function Navigation() {
	return (
		<Stack.Navigator initialRouteName="SignInNavigation">
			<Stack.Screen
				name="SignInNavigation"
				component={SignInTabNavigation}
				options={{
					title: "",
					headerTransparent: true,
				}}
			/>
			<Stack.Screen
				name="AppNavigation"
				component={AppNavigation}
				options={{
					title: "",
					headerTransparent: true,
				}}
			/>
		</Stack.Navigator>
	);
}
