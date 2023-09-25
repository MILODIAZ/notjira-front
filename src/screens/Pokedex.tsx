import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { getPokemonsApi, getPokemonDetailsByUrlApi } from "../api/pokemon";
import PokemonList from "../components/PokemonList";

export default function PokedexScreen() {
	const [pokemons, setPokemons] = useState([]);
	console.log("pokemons ------>", pokemons);

	useEffect(() => {
		(async () => {
			await loadPokemons();
		})();
	}, []);

	const loadPokemons = async () => {
		try {
			const response = await getPokemonsApi();
			const pokemonArray = [];
			for await (const pokemon of response.results) {
				const pokemonDetails = await getPokemonDetailsByUrlApi(
					pokemon.url
				);
				pokemonArray.push({
					id: pokemonDetails.id,
					name: pokemonDetails.name,
					type: pokemonDetails.types[0].name,
					order: pokemonDetails.order,
					image: pokemonDetails.sprites.other["official-artwork"]
						.front_default,
				});
			}
			setPokemons([...pokemons, ...pokemonArray]);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SafeAreaView>
			<PokemonList pokemons={pokemons} />
		</SafeAreaView>
	);
}
