import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { capitalize } from "lodash";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import getColorByPokemonType from "../utils/getColorByPokemonType";
import type { PokedexStackParamList } from "../navigation/PokedexNavigation";

type PokemonCardProps = {
	pokemon: any;
};

export default function PokemonCard<PokemonCardProps>(props) {
	const { pokemon } = props;
	const navigation =
		useNavigation<NativeStackNavigationProp<PokedexStackParamList>>();

	const pokemonColor = getColorByPokemonType(pokemon.type);

	const bgStyles = { backgroundColor: pokemonColor, ...styles.bgStyles };

	const goToPokemon = () => {
		navigation.navigate("Pokemon", { pokemon: pokemon });
	};

	return (
		<TouchableWithoutFeedback onPress={goToPokemon}>
			<View style={styles.card}>
				<View style={styles.spacing}>
					<View style={bgStyles}>
						<Text style={styles.number}>
							#{`${pokemon.id}`.padStart(3, "0")}
						</Text>
						<Text style={styles.name}>
							{capitalize(pokemon.name)}
						</Text>
						<Image
							source={{ uri: pokemon.image }}
							style={styles.image}
						/>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		height: 130,
	},
	spacing: {
		flex: 1,
		padding: 5,
	},
	name: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 15,
		paddingTop: 10,
	},
	bgStyles: {
		flex: 1,
		borderRadius: 5,
		padding: 10,
	},
	number: {
		position: "absolute",
		right: 10,
		top: 10,
		color: "#fff",
		fontSize: 11,
	},
	image: {
		position: "absolute",
		bottom: 2,
		right: 2,
		width: 90,
		height: 90,
	},
});
