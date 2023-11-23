import {
	Text,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	View,
	FlatList,
	LogBox,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import { getTasks, removeTask, taskStatus } from "../api/api.connection";
import { getDate } from "../utils/functions";

export default function Tasks() {
	const [tasks, setTasks] = useState([]);
	const [editTaskSubmitting, setEditTaskSubmitting] = useState(false);
	const [editTaskError, setEditTaskError] = useState("");

	const { refresh, refreshPage, auth } = useAuth();

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const taskData = await getTasks();
				setTasks(taskData.data);
				console.log(refresh);
			} catch (error) {
				console.error("Error al obtener tareas:", error);
			}
		};
		fetchTeams();
	}, [refresh]);

	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
	}, []);

	async function changeTaskStatus(id: number, status: string, init: boolean) {
		setEditTaskSubmitting(true);
		try {
			const response = await taskStatus(
				id,
				status,
				getDate(),
				init,
				auth.userName
			);
			console.log(response);
			if (response == true) {
				refreshPage();
			} else {
				setEditTaskError(`Error al eliminar tarea`);
			}
		} catch (error) {
			setEditTaskError("Error inesperado");
		} finally {
			setEditTaskSubmitting(false);
		}
	}

	async function deleteTask(id: number) {
		setEditTaskSubmitting(true);

		try {
			const response = await removeTask(id);
			console.log(response);
			if (response == true) {
				refreshPage();
			} else {
				setEditTaskError(`Error al eliminar tarea`);
			}
		} catch (error) {
			setEditTaskError("Error inesperado");
		} finally {
			setEditTaskSubmitting(false);
		}
	}

	type ItemProps = { title: string; id: number };

	const PendingTaskItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity
			onPress={() => console.log()}
			disabled={editTaskSubmitting}
		>
			<View style={styles.item}>
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity
					onPress={() => changeTaskStatus(id, "en progreso", true)}
					disabled={editTaskSubmitting}
					style={styles.button}
				>
					<Text>Tomar</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	const InProgressTaskItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity
			onPress={() => console.log()}
			disabled={editTaskSubmitting}
		>
			<View style={styles.item2}>
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity
					onPress={() => changeTaskStatus(id, "finalizada", false)}
					style={styles.button2}
					disabled={editTaskSubmitting}
				>
					<Text>Finalizar</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	const FinishedTaskItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity
			onPress={() => console.log()}
			disabled={editTaskSubmitting}
		>
			<View style={styles.item3}>
				<Text style={styles.title}>{title}</Text>
				<TouchableOpacity
					onPress={() => deleteTask(id)}
					style={styles.button3}
					disabled={editTaskSubmitting}
				>
					<Text>Ocultar</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<KeyboardAwareScrollView>
			<Text style={styles.title}>Tareas</Text>
			<FlatList
				data={tasks.filter(
					(item) =>
						!item.deleted &&
						item.status === "en progreso" &&
						item.responsable != null &&
						item.responsable.userName === auth.userName
				)}
				renderItem={({ item }) => (
					<InProgressTaskItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.id}
			/>

			<Text style={styles.title}>Pendientes</Text>
			<FlatList
				data={tasks.filter(
					(item) => !item.deleted && item.status === "pendiente"
				)}
				renderItem={({ item }) => (
					<PendingTaskItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.id}
			/>

			<Text style={styles.title}>Completadas</Text>
			<FlatList
				data={tasks.filter(
					(item) =>
						!item.deleted &&
						item.status === "finalizada" &&
						item.responsable != null &&
						item.responsable.userName === auth.userName
				)}
				renderItem={({ item }) => (
					<FinishedTaskItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	error: {
		textAlign: "center",
		color: "#f00",
	},
	container: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	item2: {
		backgroundColor: "#FFFACD",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	item3: {
		backgroundColor: "#32CD32",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: 32,
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	button: {
		marginLeft: 160,
		backgroundColor: "#FFFACD",
		padding: 10,
	},
	button2: {
		marginLeft: 10,
		backgroundColor: "#32CD32",
		padding: 10,
	},
	button3: {
		marginLeft: 160,
		backgroundColor: "red",
		padding: 10,
	},
});
