import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignInTabNavigation from "./SignInTabNavigation";
import AppNavigation from "./AppNavigation";
import EditProfile from "../screens/EditProfile";
import EditTeam from "../screens/EditTeam";
import EditProject from "../screens/EditProject";
import EditTask from "../screens/EditTask";

const Stack = createNativeStackNavigator();

export default function Navigation(): React.JSX.Element {
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
			<Stack.Screen
				name="EditProfile"
				component={EditProfile}
				options={{
					title: "Editar perfil",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="EditTeam"
				component={EditTeam}
				options={{
					title: "Editar equipo",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="EditProject"
				component={EditProject}
				options={{
					title: "Editar proyecto",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="EditTask"
				component={EditTask}
				options={{
					title: "Editar tarea",
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
}
