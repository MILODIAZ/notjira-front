import { Text, FlatList } from "react-native";
import TeamItem from "./TeamItem";
import { useState, useEffect } from "react";

const TeamsList = () => {
	const [teams, setTeams] = useState([]);

	const fetchTeams = async () => {
		const response = await fetch("http://10.0.2.2:8000/api/v1/team");
		const data = await response.json();
		setTeams(data.data);
	};
	useEffect(() => {
		fetchTeams();
	}, []);

	return (
		<FlatList
			data={teams}
			ItemSeparatorComponent={() => <Text></Text>}
			renderItem={({ item: team }) => <TeamItem {...team} />}
		/>
	);
};
export default TeamsList;
