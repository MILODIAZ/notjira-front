import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { getPokemonsApi, getPokemonDetailsByUrlApi } from "../api/pokemon";
import PokemonList from "../components/PokemonList";

export default function PokedexScreen() {
	const [pokemons, setPokemons] = useState([]);
	const [nextUrl, setNextUrl] = useState(null);
	const [loading, setLoading] = useState(false);

	const loadPokemons = async () => {
		try {
			setLoading(true);
			const response = await getPokemonsApi(nextUrl);
			setNextUrl(response.next);
			const pokemonArray = [];
			for await (const pokemon of response.results) {
				const pokemonDetails = await getPokemonDetailsByUrlApi(
					pokemon.url
				);
				pokemonArray.push({
					id: pokemonDetails.id,
					name: pokemonDetails.name,
					type: pokemonDetails.types[0].type.name,
					types: pokemonDetails.types,
					order: pokemonDetails.order,
					image: pokemonDetails.sprites.other["official-artwork"]
						.front_default,
					stats: pokemonDetails.stats,
				});
			}
			setPokemons([...pokemons, ...pokemonArray]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			await loadPokemons();
		})();
	}, []);

	return (
		<SafeAreaView>
			<PokemonList
				pokemons={pokemons}
				loadPokemons={loadPokemons}
				isNext={nextUrl}
				isLoading={loading}
			/>
		</SafeAreaView>
	);
}
