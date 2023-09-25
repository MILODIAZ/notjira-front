import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";

import FavoriteNavigation from "./FavoriteNavigation";
import PokedexNavigation from "./PokedexNavigation";
import AccountNavigation from "./AccountNavigation";

const Tab = createBottomTabNavigator();

export default function Navigation() {
	return (
		<Tab.Navigator initialRouteName="Favorite">
			<Tab.Screen
				name="FavoriteTab"
				component={FavoriteNavigation}
				options={{
					tabBarLabel: "Favoritos",
					tabBarIcon: ({ color, size }) => (
						<Icon name="heart" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="PokedexTab"
				component={PokedexNavigation}
				options={{
					tabBarLabel: "",
					tabBarIcon: () => renderPokeball(),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="AccountTab"
				component={AccountNavigation}
				options={{
					tabBarLabel: "Mi cuenta",
					tabBarIcon: ({ color, size }) => (
						<Icon name="user" color={color} size={size} />
					),
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

function renderPokeball() {
	return (
		<Image
			source={require("../assets/pokeball.png")}
			style={{ width: 75, height: 75, top: -15 }}
		/>
	);
}
