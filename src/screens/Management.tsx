import {
	SafeAreaView,
	Text,
	Button,
	View,
	Modal,
	TextInput,
	StyleSheet,
	Alert,
} from "react-native";
import React, { useState } from "react";
import TeamsList from "../components/TeamsList";
import { registerTeam } from "../api/api.connection";
export default function Management() {
	const [visibilty, setVisibilty] = useState(false);
	const [teamName, setTeamName] = useState("");

	const openModal = () => {
		setTeamName("");
		setVisibilty(true);
	};
	const closeModal = () => {
		setVisibilty(false);
	};
	const registry = async () => {
		const response = await registerTeam(teamName);
		setVisibilty(false);
	};
	return (
		<SafeAreaView>
			<TeamsList />
			<View style={{ alignItems: "flex-end" }}>
				<Button title="Registrar equipo" onPress={openModal}></Button>
			</View>
			<Modal visible={visibilty}>
				<View style={styles.modal}>
					<View style={{ alignItems: "flex-end" }}>
						<Button title="X" onPress={closeModal}></Button>
					</View>
					<Text>Registrar Equipo</Text>
					<TextInput
						style={styles.textInputStyle}
						value={teamName}
						onChangeText={setTeamName}
					></TextInput>
					<Button title="registrar" onPress={registry}></Button>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	textInputStyle: {
		borderWidth: 1,
		borderRadius: 4,
		paddingLeft: 10,
	},
	modal: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
