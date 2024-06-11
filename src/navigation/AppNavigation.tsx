import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";

import Profile from "../screens/Profile";
import Management from "../screens/Management";
import Tasks from "../screens/Tasks";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
	return (
		<Tab.Navigator initialRouteName="Tasks">
			<Tab.Screen
				testId="Management"
				name="Management"
				component={Management}
				options={{
					tabBarLabel: "Gestionar",
					tabBarIcon: ({ color, size }) => (
						<Icon name="address-book" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				testId="Tasks"
				name="Tasks"
				component={Tasks}
				options={{
					tabBarLabel: "",
					tabBarIcon: () => renderTasksIcon(),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				testId="Profile"
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: "Perfil",
					tabBarIcon: ({ color, size }) => (
						<Icon name="user" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

function renderTasksIcon() {
	return (
		<Image
			source={require("../assets/tasks-icon.png")}
			style={{ width: 75, height: 75, top: -15 }}
		/>
	);
}
