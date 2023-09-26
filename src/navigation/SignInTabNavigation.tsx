import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";

import Login from "../screens/Login";
import Register from "../screens/Register";
import PasswordRecovery from "../screens/PasswordRecovery";

const Tab = createBottomTabNavigator();

export default function SignInTabNavigation() {
	return (
		<Tab.Navigator initialRouteName="Login">
			<Tab.Screen
				name="Register"
				component={Register}
				options={{
					tabBarLabel: "Registrarse",
					tabBarIcon: ({ color, size }) => (
						<Icon name="user-plus" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Login"
				component={Login}
				options={{
					tabBarLabel: "Ingresar",
					tabBarIcon: ({ color, size }) => (
						<Icon name="lock" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Password Recovery"
				component={PasswordRecovery}
				options={{
					tabBarLabel: "Olvidé mi contraseña",
					tabBarIcon: ({ color, size }) => (
						<Icon name="unlock" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}
