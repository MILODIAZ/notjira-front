import { View, Text, Button, Modal, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { registerUserOnTeam } from "../api/api.connection";
const AddUserTeam = (props) => {
	const [userName, setUserName] = useState("");

	const registry = async () => {
		await registerUserOnTeam(props.id, userName);
	};
	return (
		<Modal
			animationType="slide"
			visible={props.visibility}
			onRequestClose={props.onClose}
		>
			<View>
				<Text>Nombre de usuario del nuevo integrante</Text>
				<TextInput
					style={styles.textInputStyle}
					value={props.userName}
					onChangeText={setUserName}
				></TextInput>
				<Button title="añadir integrante" onPress={registry}></Button>
				<Button title="cerrar" onPress={props.onClose}></Button>
			</View>
		</Modal>
	);
};
const styles = StyleSheet.create({
	modal: {
		flex: 1,
		backgroundColor: "lightblue",
		padding: 60,
		marginHorizontal: 30,
		marginBottom: 70,
	},
	editBtn: {
		width: 150,
		margin: 10,
		padding: 10,
	},
	textInputStyle: {
		borderWidth: 1,
		borderRadius: 4,
		paddingLeft: 10,
	},
});

export default AddUserTeam;
