import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Profile from "../screens/Profile";
import Management from "../screens/Management";
import Tasks from "../screens/Tasks";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
	return (
		<Tab.Navigator initialRouteName="Tasks">
			<Tab.Screen name="Management" component={Management} />
			<Tab.Screen name="Tasks" component={Tasks} />
			<Tab.Screen name="Profile" component={Profile} />
		</Tab.Navigator>
	);
}
