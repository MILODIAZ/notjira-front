import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import useAuth from "../../hooks/useAuth";

export default function UserData(props) {
	const { navigation } = props;

	const { auth, logout } = useAuth();

	const editNavigation = () => {
		navigation.navigate("EditProfile");
	};

	return (
		<View style={styles.content}>
			<View style={styles.titleBlock}>
				<Text style={styles.title}>Bienvenid@,</Text>
				<Text
					style={styles.title}
				>{`${auth.name} ${auth.lastName}`}</Text>
			</View>

			<View style={styles.dataContent}>
				<ItemMenu
					title="Nombre:"
					text={`${auth.name} ${auth.lastName}`}
				/>
				<ItemMenu title="Username:" text={auth.userName} />
				<ItemMenu title="Email:" text={auth.email} />
			</View>

			<Button
				style={styles.editBtn}
				title="Editar"
				onPress={editNavigation}
			/>

			<Button
				title="Desconectarse"
				onPress={() => {
					logout();
					navigation.navigate("SignInNavigation");
					navigation.reset({
						index: 0,
						routes: [{ name: "SignInNavigation" }],
					});
				}}
				style={styles.btnLogout}
			/>
		</View>
	);
}

function ItemMenu(props) {
	const { title, text } = props;
	return (
		<View style={styles.itemMenu}>
			<Text style={styles.itemMenuTitle}>{title}</Text>
			<Text>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		marginHorizontal: 20,
		marginTop: 20,
	},
	titleBlock: {
		marginBottom: 30,
	},
	title: {
		fontWeight: "bold",
		fontSize: 22,
	},
	dataContent: {
		marginBottom: 20,
	},
	itemMenu: {
		flexDirection: "row",
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderColor: "#CFCFCF",
	},
	itemMenuTitle: {
		fontWeight: "bold",
		paddingRight: 10,
		width: 120,
	},
	btonLogout: {
		paddingTop: 20,
	},
	editBtn: {
		marginTop: 10,
	},
});
