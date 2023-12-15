import {
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
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import useAuth from "../hooks/useAuth";
import { getTasks, removeTask, taskStatus } from "../api/api.connection";
import { getDate } from "../utils/functions";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Avatar, Button, Card, Divider, Text } from "react-native-paper";

type RootStackParamList = {
	Home: undefined;
	Task: {
		taskId: number;
		taskName: string;
		taskDescription: string;
		taskStart: string;
		taskEnd: string;
		taskResponsable: string;
		taskCreator: string;
		taskProject: string;
		taskComments: Comment[];
	};
};
type TasksScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Home"
>;
type TasksScreenRouteProp = RouteProp<RootStackParamList, "Home">;
type TasksProps = {
	navigation: TasksScreenNavigationProp;
	route: TasksScreenRouteProp;
};

export interface Comment {
	id: number;
	content: string;
	user: { userName: string };
}

interface TaskItem {
	id: number;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	status: string;
	responsable: {
		userName: string;
	};
	creator: {
		userName: string;
	};
	project: {
		name: string;
	};
	deleted: boolean;
	comments: Comment[];
}

export default function Tasks(props: TasksProps) {
	const { navigation } = props;
	const [tasks, setTasks] = useState<TaskItem[]>([]);
	const [editTaskSubmitting, setEditTaskSubmitting] = useState(false);
	const [editTaskError, setEditTaskError] = useState("");

	const { refresh, refreshPage, auth } = useAuth();

	const [filterName, setFilterName] = useState("");

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const jwt = auth?.jwt || "";

				const taskData = await getTasks(filterName, jwt);
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
			const userName = auth?.userName || "";
			const jwt = auth?.jwt || "";

			const response = await taskStatus(
				id,
				status,
				getDate(),
				init,
				userName,
				jwt
			);

			console.log(response);

			if (response === true) {
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
			const jwt = auth?.jwt || "";

			const response = await removeTask(id, jwt);
			console.log(response);

			if (response === true) {
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
		comments: Comment[];
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
		comments,
	}: ItemProps) => (
		<Card mode="outlined">
			<Card.Title
				title={title}
				left={(props) => <Avatar.Icon {...props} icon="pen" />}
				titleVariant="headlineMedium"
			/>
			<Card.Actions>
				<Button
					onPress={() => {
						console.log(comments);

						goToTask(
							id,
							title,
							description,
							startDate,
							endDate,
							responsable,
							creator,
							project,
							comments
						);
					}}
					disabled={editTaskSubmitting}
				>
					Detalle
				</Button>
				<Button
					onPress={() => changeTaskStatus(id, "en progreso", true)}
					disabled={editTaskSubmitting}
					loading={editTaskSubmitting}
					buttonColor="#d06aff"
				>
					Tomar
				</Button>
			</Card.Actions>
		</Card>
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
		comments,
	}: ItemProps) => (
		<Card mode="outlined">
			<Card.Title
				title={title}
				left={(props) => <Avatar.Icon {...props} icon="pen" />}
				titleVariant="headlineMedium"
			/>
			<Card.Actions>
				<Button
					onPress={() => {
						console.log(comments);

						goToTask(
							id,
							title,
							description,
							startDate,
							endDate,
							responsable,
							creator,
							project,
							comments
						);
					}}
					disabled={editTaskSubmitting}
				>
					Detalle
				</Button>
				<Button
					onPress={() => changeTaskStatus(id, "finalizada", false)}
					disabled={editTaskSubmitting}
					loading={editTaskSubmitting}
					buttonColor="#7052ff"
				>
					Finalizar
				</Button>
			</Card.Actions>
		</Card>
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
		comments,
	}: ItemProps) => (
		<Card mode="outlined">
			<Card.Title
				title={title}
				left={(props) => <Avatar.Icon {...props} icon="pen" />}
				titleVariant="headlineMedium"
			/>
			<Card.Actions>
				<Button
					onPress={() =>
						goToTask(
							id,
							title,
							description,
							startDate,
							endDate,
							responsable,
							creator,
							project,
							comments
						)
					}
					disabled={editTaskSubmitting}
				>
					Detalle
				</Button>
				<Button
					onPress={() => deleteTask(id)}
					disabled={editTaskSubmitting}
					loading={editTaskSubmitting}
					buttonColor="#ff7360"
				>
					Ocultar
				</Button>
			</Card.Actions>
		</Card>
	);

	function goToTask(
		id: number,
		name: string,
		description: string,
		startDate: string,
		endDate: string,
		responsable: string,
		creator: string,
		project: string,
		comments: Comment[]
	) {
		navigation.navigate("Task", {
			taskId: id,
			taskName: name,
			taskDescription: description,
			taskStart: startDate,
			taskEnd: endDate,
			taskResponsable: responsable,
			taskCreator: creator,
			taskProject: project,
			taskComments: comments,
		});
	}

	return (
		<KeyboardAwareScrollView style={{ paddingHorizontal: 8 }}>
			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginTop: 40,
					fontWeight: "bold",
				}}
			>
				Tareas
			</Text>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginTop: 20,
					marginBottom: 20,
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

			<FlatList<TaskItem>
				data={tasks.filter(
					(item) =>
						!item.deleted &&
						item.status === "en progreso" &&
						item.responsable != null &&
						item.responsable.userName === auth?.userName
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
						comments={item.comments}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
			<Divider bold={true} style={{ marginTop: 30 }} />

			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginBottom: 20,
					marginTop: 20,
					fontWeight: "bold",
				}}
			>
				Pendientes
			</Text>
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
						comments={item.comments}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
			<Divider bold={true} style={{ marginTop: 30 }} />

			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginBottom: 20,
					marginTop: 20,
					fontWeight: "bold",
				}}
			>
				Completadas
			</Text>
			<FlatList
				style={{ marginBottom: 50 }}
				data={tasks.filter(
					(item) =>
						!item.deleted &&
						item.status === "finalizada" &&
						item.responsable != null &&
						item.responsable.userName === auth?.userName
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
						comments={item.comments}
					/>
				)}
				keyExtractor={(item) => item.id.toString()}
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
