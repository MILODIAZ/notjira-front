import {
	Text,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	View,
	FlatList,
	LogBox,
	TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import { getTasks, removeTask, taskStatus } from "../api/api.connection";
import { getDate } from "../utils/functions";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Tasks(props) {
	const { navigation } = props;
	const [tasks, setTasks] = useState([]);
	const [editTaskSubmitting, setEditTaskSubmitting] = useState(false);
	const [editTaskError, setEditTaskError] = useState("");

	const { refresh, refreshPage, auth } = useAuth();

	const [filterName, setFilterName] = useState("");

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const taskData = await getTasks(filterName);
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

	type ItemProps = {
		title: string;
		id: number;
		description: string;
		startDate: string;
		endDate: string;
		responsable: string;
		creator: string;
		project: string;
	};

	const PendingTaskItem = ({
		title,
		id,
		description,
		startDate,
		endDate,
		responsable,
		creator,
		project,
	}: ItemProps) => (
		<TouchableOpacity
			onPress={() =>
				goToTask(
					title,
					description,
					startDate,
					endDate,
					responsable,
					creator,
					project
				)
			}
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

	const InProgressTaskItem = ({
		title,
		id,
		description,
		startDate,
		endDate,
		responsable,
		creator,
		project,
	}: ItemProps) => (
		<TouchableOpacity
			onPress={() =>
				goToTask(
					title,
					description,
					startDate,
					endDate,
					responsable,
					creator,
					project
				)
			}
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

	const FinishedTaskItem = ({
		title,
		id,
		description,
		startDate,
		endDate,
		responsable,
		creator,
		project,
	}: ItemProps) => (
		<TouchableOpacity
			onPress={() =>
				goToTask(
					title,
					description,
					startDate,
					endDate,
					responsable,
					creator,
					project
				)
			}
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

	function goToTask(
		name: string,
		description: string,
		startDate: string,
		endDate: string,
		responsable: string,
		creator: string,
		project: string
	) {
		navigation.navigate("Task", {
			taskName: name,
			taskDescription: description,
			taskStart: startDate,
			taskEnd: endDate,
			taskResponsable: responsable,
			taskCreator: creator,
			taskProject: project,
		});
	}

	return (
		<KeyboardAwareScrollView>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginTop: 20,
				}}
			>
				<TextInput
					style={{
						flex: 1,
						height: 40,
						borderColor: "gray",
						borderWidth: 1,
						paddingLeft: 10,
						marginLeft: 15,
					}}
					placeholder="Buscar..."
					value={filterName}
					onChangeText={(text) => setFilterName(text)}
				/>
				<TouchableOpacity
					onPress={() => refreshPage()}
					style={{ padding: 10 }}
				>
					<Icon name="search" size={20} color="black" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						setFilterName("");
						refreshPage();
					}}
					style={{ padding: 10 }}
				>
					<Icon name="times-circle" size={20} color="black" />
				</TouchableOpacity>
			</View>

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
					<InProgressTaskItem
						title={item.name}
						id={item.id}
						description={item.description}
						startDate={item.startDate}
						endDate="-"
						responsable={item.responsable.userName}
						creator={item.creator.userName}
						project={item.project.name}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>

			<Text style={styles.title}>Pendientes</Text>
			<FlatList
				data={tasks.filter(
					(item) => !item.deleted && item.status === "pendiente"
				)}
				renderItem={({ item }) => (
					<PendingTaskItem
						title={item.name}
						id={item.id}
						description={item.description}
						startDate="-"
						endDate="-"
						responsable="-"
						creator={item.creator.userName}
						project={item.project.name}
					/>
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
					<FinishedTaskItem
						title={item.name}
						id={item.id}
						description={item.description}
						startDate={item.startDate}
						endDate={item.endDate}
						responsable={item.responsable.userName}
						creator={item.creator.userName}
						project={item.project.name}
					/>
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
