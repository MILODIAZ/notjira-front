import { View, Text, Button, Modal, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import appTheme from "../utils/theme";
import {
	GestureHandlerRootView,
	TextInput,
} from "react-native-gesture-handler";
import { registerUserOnTeam, removeUserFromTeam } from "../api/api.connection";
import AddUserTeam from "./AddUserTeam";
import UserItem from "./UserItem";

const EditTeam = (props) => {
	const [visibility, setVisibilty] = useState(false);

	const openModal = () => {
		setVisibilty(true);
	};
	const closeModal = () => {
		setVisibilty(false);
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={props.visibility}
			onRequestClose={props.onClose}
		>
			<View style={styles.modal}>
				<Text>Integrantes</Text>
				{props.users.map((user) => (
					<UserItem id={props.id} userName={user.userName} />
				))}
				<Button title="añadir integrante" onPress={openModal}></Button>
				<Button title="cerrar" onPress={props.onClose}></Button>
			</View>
			<GestureHandlerRootView>
				<AddUserTeam
					visibility={visibility}
					onClose={closeModal}
					id={props.id}
				/>
			</GestureHandlerRootView>
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

export default EditTeam;
