import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native";
import EditTeam from "./EditTeam";
import { removeTeam } from "../api/api.connection";

const TeamItem = (props) => {
	const [isVisible, setIsVisible] = useState(false);

	const deleteTeam = async () => {
		await removeTeam(props.id);
	};
	const openModal = () => {
		setIsVisible(true);
	};

	const closeModal = () => {
		setIsVisible(false);
	};
	return (
		<View key={props.id} style={styles.container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Text>{props.name}</Text>
				<Button title="X" onPress={deleteTeam}></Button>
			</View>
			{props.users.map((user) => (
				<Text key={user.id}>{user.username}</Text>
			))}
			<Button
				title="editar equipo"
				style={styles.editBtn}
				onPress={openModal}
			/>
			<EditTeam
				visibility={isVisible}
				onClose={closeModal}
				users={props.users}
				teamName={props.teamName}
				id={props.id}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		padding: 5,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: "#7a7a7a",
	},
	editBtn: {
		width: 150,
		margin: 10,
		padding: 10,
	},
});

export default TeamItem;
