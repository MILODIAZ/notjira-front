import { Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
/*import { getPokemonDetailsApi } from "../api/pokemon";*/
import Icon from "react-native-vector-icons/FontAwesome5";
import Header from "../components/Pokemon/Header";
import Type from "../components/Pokemon/Type";
import Stats from "../components/Pokemon/Stats";

export default function PokemonScreen(props) {
	const {
		navigation,
		route: { params },
	} = props;
	const [pokemon, setPokemon] = useState(null);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => null,
			headerLeft: () => (
				<Icon
					name="arrow-left"
					color="#fff"
					size={20}
					style={{ marginLeft: 20 }}
					onPress={navigation.goBack}
				/>
			),
		});
	}, [navigation, params]);

	useEffect(() => {
		setPokemon(params.pokemon);
	}, [params]);

	if (!pokemon) return null;

	return (
		<ScrollView>
			<Header
				name={pokemon.name}
				order={pokemon.id}
				image={pokemon.image}
				type={pokemon.type}
			/>
			<Type types={pokemon.types} />
			<Stats stats={pokemon.stats} />
		</ScrollView>
	);
}
