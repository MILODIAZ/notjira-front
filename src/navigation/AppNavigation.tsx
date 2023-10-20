import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";

import Profile from "../screens/Profile";
import Management from "../screens/Management";
import Tasks from "../screens/Tasks";
import EditProfile from "../screens/EditProfile";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
	return (
		<Tab.Navigator initialRouteName="Tasks">
			<Tab.Screen
				name="Management"
				component={Management}
				options={{
					tabBarLabel: "Gestionar",
					tabBarIcon: ({ color, size }) => (
						<Icon name="address-book" color={color} size={size} />
					),
					headerShown: true,
				}}
			/>
			<Tab.Screen
				name="Tasks"
				component={Tasks}
				options={{
					tabBarLabel: "",
					tabBarIcon: () => renderTasksIcon(),
					headerShown: true,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: "Perfil",
					tabBarIcon: ({ color, size }) => (
						<Icon name="user" color={color} size={size} />
					),
					headerShown: true,
				}}
			/>
			<Tab.Screen
				name="EditProfile"
				component={EditProfile}
				options={{
					tabBarLabel: "Editar",
					tabBarIcon: ({ color, size }) => (
						<Icon name="user" color={color} size={size} />
					),
					headerShown: true,
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
