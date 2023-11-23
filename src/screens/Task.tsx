import { SafeAreaView, View, Text, StyleSheet, Button } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";

export default function Task(props) {
	const route = useRoute();

	const {
		taskName,
		taskCreator,
		taskResponsable,
		taskStart,
		taskEnd,
		taskDescription,
		taskProject,
	} = route.params || {};

	return (
		<SafeAreaView>
			<View style={styles.content}>
				<View style={styles.titleBlock}>
					<Text style={styles.title}>{taskName}</Text>
				</View>

				<View style={styles.dataContent}>
					<ItemMenu title="Proyecto:" text={taskProject} />
					<ItemMenu title="Creado por:" text={taskCreator} />
					<ItemMenu title="Responsable:" text={taskResponsable} />
					<ItemMenu
						title="Fecha de inicio:"
						text={taskStart.replace("T", " ").substring(0, 19)}
					/>
					<ItemMenu
						title="Fecha de finalización:"
						text={taskEnd.replace("T", " ").substring(0, 19)}
					/>
					<ItemMenu title="Descripción:" text={taskDescription} />
				</View>
			</View>
		</SafeAreaView>
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
