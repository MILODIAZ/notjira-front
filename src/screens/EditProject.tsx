import {
	Text,
	StyleSheet,
	TextInput,
	Button,
	TouchableOpacity,
	View,
	FlatList,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import {
	updateProject,
	getProject,
	removeProject,
	getTask,
	createTask,
} from "../api/api.connection";

type RootStackParamList = {
	EditTeam: {
	  teamId: number;
	  teamName: string;
	  teamUsers: Object[];
	  teamProjects: Object[];
	};
	Management: undefined;
	EditProject: {
	  projectId: number;
	  projectName: string;
	  projectTasks: { id: number; name: string; description: string; deleted?: boolean }[];
	};
	EditTask: {
	  taskId: number;
	  taskName: string;
	  taskDescription: string;
	};
  };

  type EditProjectScreenRouteProp = RouteProp<RootStackParamList, "EditProject">;
  type EditProjectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "EditProject">;

  type EditProjectProps = {
	navigation: EditProjectScreenNavigationProp;
	route: EditProjectScreenRouteProp;
  };

export default function EditProject(props: EditProjectProps) {
	const { navigation } = props;
	const route = useRoute();
	const { refresh, refreshPage, auth } = useAuth();
	const routeParams = route.params as RootStackParamList["EditProject"];
	const { projectId, projectName, projectTasks } = routeParams || {};

	const [project, setProject] = useState(projectName);
	const [tasks, setTasks] = useState(projectTasks);
	const [editProjectSubmitting, setEditProjectSubmitting] = useState(false);
	const [editProjectError, setEditProjectError] = useState("");
	const [auxEditProjectBoolean, setAuxEditProjectBoolean] = useState(false);

	function projectNewNameInitialValues() {
		return {
			name: "",
		};
	}

	function projectNewNameValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nuevo nombre del proyecto"),
		};
	}

	const editProjectFormik = useFormik({
		initialValues: projectNewNameInitialValues(),
		validationSchema: Yup.object(projectNewNameValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setEditProjectError("");
			setEditProjectSubmitting(true);
			const { name } = formValue;
			try {
				if (auth?.jwt) {
					const response = await updateProject(projectId, name, auth.jwt);
					console.log(response);
					if (response === true) {
					  editProjectFormik.resetForm();
					  console.log("here in editProject");
					  setAuxEditProjectBoolean(!auxEditProjectBoolean);
					  refreshPage();
					} else {
					  setEditProjectError("Nombre de proyecto ya está utilizado");
					}
				  }
			} catch (error) {
				setEditProjectError("Error inesperado");
			} finally {
				setEditProjectSubmitting(false);
			}
		},
	});

	async function deleteProject(id: number) {
		try {
			if(auth?.jwt){
				const response = await removeProject(id, auth.jwt);
			console.log(response);
			if (response == true) {
				navigation.navigate("Management");
				refreshPage();
			} else {
				setEditProjectError(`Error al eliminar proyecto`);
			}
			}
			
		} catch (error) {
			setEditProjectError("Error inesperado");
		} finally {
			setEditProjectSubmitting(false);
		}
	}

	type ItemProps = { title: string; id: number };

	const goToTask = async (id: number) => {
		try {
			if(auth?.jwt){
				const taskData = await getTask(id, auth.jwt);
				const taskId = taskData.data.id;
				const taskName = taskData.data.name;
				const taskDescription = taskData.data.description;
				navigation.navigate("EditTask", {
					taskId: taskId,
					taskName: taskName,
					taskDescription: taskDescription,
				});
			}
			
		} catch (error) {
			console.error("Error al obtener tarea:", error);
		}
	};

	const TeamItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity onPress={() => goToTask(id)}>
			<View style={styles.item}>
				<Text style={styles.title}>{title}</Text>
			</View>
		</TouchableOpacity>
	);

	const [newTaskError, setNewTaskError] = useState("");
	const [auxNewTaskBoolean, setAuxNewTaskBoolean] = useState(false);

	const newTaskFormik = useFormik({
		initialValues: newTaskInitialValues(),
		validationSchema: Yup.object(newTaskValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setNewTaskError("");
			setEditProjectSubmitting(true);
			const { name, description } = formValue;
			try {
				if (auth?.jwt && auth?.userName) {
					const response = await createTask(
					  projectId,
					  auth.userName,
					  name,
					  description,
					  auth.jwt
					);
					console.log(response);
					if (response === true) {
					  newTaskFormik.resetForm();
					  setAuxNewTaskBoolean(!auxNewTaskBoolean);
					  refreshPage();
					} else {
					  setNewTaskError("Nombre de tarea ya está utilizado");
					}
				  } 
			} catch (error) {
				setNewTaskError("Error inesperado");
			} finally {
				setEditProjectSubmitting(false);
			}
		},
	});

	function newTaskInitialValues() {
		return {
			name: "",
			description: "",
		};
	}

	function newTaskValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nombre de la tarea"),
			description: Yup.string().required("Escriba una descripción"),
		};
	}

	useEffect(() => {
		const fetchProject = async () => {
			try {
				if(auth?.jwt){
					const projectData = await getProject(projectId, auth.jwt);
					setProject(projectData.data.name);
					setTasks(projectData.data.tasks);
					console.log(refresh);
				}				
			} catch (error) {
				console.error("Error al obtener proyecto:", error);
			}
		};
		fetchProject();
	}, [refresh, auxEditProjectBoolean, auxNewTaskBoolean]);

	return (
		<KeyboardAwareScrollView>
			<Text style={styles.title}>{project}</Text>

			<Text style={styles.error}>{editProjectError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editProjectFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de proyecto"
				value={editProjectFormik.values.name}
			/>
			<Text style={styles.error}>{editProjectFormik.errors.name}</Text>
			<Button
				title="Cambiar nombre"
				onPress={()=>editProjectFormik.handleSubmit()}
				disabled={editProjectSubmitting}
			/>

			<Text style={styles.title}>Tareas</Text>
			<FlatList
				data={tasks.filter((item) => !item.deleted)}
				renderItem={({ item }) => (
					<TeamItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.id.toString()}
				scrollEnabled={false}
			/>
			<Text style={styles.error}>{newTaskError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					newTaskFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de la tarea"
				value={newTaskFormik.values.name}
			/>
			<Text style={styles.error}>{newTaskFormik.errors.name}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					newTaskFormik.setFieldValue("description", text)
				}
				placeholder="Descripción de la tarea"
				value={newTaskFormik.values.description}
			/>
			<Text style={styles.error}>{newTaskFormik.errors.description}</Text>
			<Button
				title="Crear Tarea"
				onPress={()=>newTaskFormik.handleSubmit()}
				disabled={editProjectSubmitting}
			/>

			<Button
				title="ELIMINAR PROYECTO"
				onPress={() => deleteProject(projectId)}
				disabled={editProjectSubmitting}
				color="red"
			/>
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	error: {
		textAlign: "center",
		color: "#f00",
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
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
});
