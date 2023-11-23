import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	Button,
	TouchableOpacity,
	View,
	LogBox,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import useAuth from "../hooks/useAuth";
import {
	updateTeam,
	removeUserFromTeam,
	registerUserOnTeam,
	removeTeam,
	getProject,
	getTeam,
	createProject,
} from "../api/api.connection";

export default function EditTeam(props) {
	const { navigation } = props;
	const { refresh, refreshPage } = useAuth();
	const route = useRoute();
	const { teamId, teamName, teamUsers, teamProjects } = route.params || {};

	const [projects, setProjects] = useState(teamProjects);
	const [editTeamSubmitting, setEditTeamSubmitting] = useState(false);
	const [editTeamError, setEditTeamError] = useState("");

	function teamNewNameInitialValues() {
		return {
			name: teamName,
		};
	}

	function teamNewNameValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nuevo nombre del equipo"),
		};
	}

	const editTeamFormik = useFormik({
		initialValues: teamNewNameInitialValues(),
		validationSchema: Yup.object(teamNewNameValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setEditTeamError("");
			setEditTeamSubmitting(true);
			const { name } = formValue;
			try {
				const response = await updateTeam(teamId, name);
				console.log(response);
				if (response == true) {
					editTeamFormik.resetForm();
					console.log("here in editTeam");
					navigation.navigate("Management");
					refreshPage();
				} else {
					setEditTeamError("Nombre de equipo ya está utilizado");
				}
			} catch (error) {
				setEditTeamError("Error inesperado");
			} finally {
				setEditTeamSubmitting(false);
			}
		},
	});

	const [selectedUsertoRemove, setSelectedUsertoRemove] = useState(null);

	async function removeUser() {
		setEditTeamError("");
		setEditTeamSubmitting(true);
		if (selectedUsertoRemove) {
			try {
				const response = await removeUserFromTeam(
					teamId,
					selectedUsertoRemove
				);
				console.log(response);
				if (response == true) {
					navigation.navigate("Management");
					refreshPage();
				} else {
					setEditTeamError("No se pudo eliminar al participante");
				}
			} catch (error) {
				setEditTeamError("Error inesperado");
			} finally {
				setEditTeamSubmitting(false);
			}
		} else {
			setEditTeamError("Escoge un participante");
			setEditTeamSubmitting(false);
		}
	}

	const [selectedUsertoAdd, setSelectedUsertoAdd] = useState<string | null>(
		null
	);

	async function addUser() {
		setEditTeamError("");
		setEditTeamSubmitting(true);
		if (selectedUsertoAdd) {
			try {
				const response = await registerUserOnTeam(
					teamId,
					selectedUsertoAdd
				);
				console.log(response);
				if (response.success == true) {
					navigation.navigate("Management");
					refreshPage();
				} else {
					setEditTeamError(`${response.error}`);
				}
			} catch (error) {
				setEditTeamError("Error inesperado");
			} finally {
				setEditTeamSubmitting(false);
			}
		} else {
			setEditTeamError("Escoge un participante");
			setEditTeamSubmitting(false);
		}
	}

	async function deleteTeam(id: number) {
		try {
			const response = await removeTeam(id);
			console.log(response);
			if (response == true) {
				navigation.navigate("Management");
				refreshPage();
			} else {
				setEditTeamError(`Error al eliminar equipo`);
			}
		} catch (error) {
			setEditTeamError("Error inesperado");
		} finally {
			setEditTeamSubmitting(false);
		}
	}

	type ItemProps = { title: string; id: number };

	const goToProject = async (id: number) => {
		try {
			const projectData = await getProject(id);
			const projectId = projectData.data.id;
			const projectName = projectData.data.name;
			const projectTasks = projectData.data.tasks;
			navigation.navigate("EditProject", {
				teamId: teamId,
				projectId: projectId,
				projectName: projectName,
				projectTasks: projectTasks,
			});
		} catch (error) {
			console.error("Error al obtener proyecto:", error);
		}
	};

	const TeamItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity onPress={() => goToProject(id)}>
			<View style={styles.item}>
				<Text style={styles.title}>{title}</Text>
			</View>
		</TouchableOpacity>
	);

	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
		const timestampInMilliseconds = new Date().getTime();

		// Convertir el timestamp a una cadena (string)
		const timestampString = timestampInMilliseconds.toString();

		console.log(timestampString);
	}, []);

	const [newProjectError, setNewProjectError] = useState("");
	const [auxNewProjectBoolean, setAuxNewProjectBoolean] = useState(false);

	const newProjectFormik = useFormik({
		initialValues: newProjectInitialValues(),
		validationSchema: Yup.object(newProjectValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setNewProjectError("");
			setEditTeamSubmitting(true);
			const { name } = formValue;
			try {
				const response = await createProject(name, teamId);
				console.log(response);
				if (response == true) {
					newProjectFormik.resetForm();
					setAuxNewProjectBoolean(!auxNewProjectBoolean);
				} else {
					setNewProjectError("Nombre de proyecto ya está utilizado");
				}
			} catch (error) {
				setNewProjectError("Error inesperado");
			} finally {
				setEditTeamSubmitting(false);
			}
		},
	});

	function newProjectInitialValues() {
		return {
			name: "",
		};
	}

	function newProjectValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nombre del proyecto"),
		};
	}

	useEffect(() => {
		const fetchTeamProjects = async () => {
			try {
				const teamData = await getTeam(teamId);
				setProjects(teamData.data.projects);
				console.log(refresh);
			} catch (error) {
				console.error("Error al obtener proyectos del equipo:", error);
			}
		};
		fetchTeamProjects();
	}, [auxNewProjectBoolean, refresh]);

	return (
		<KeyboardAwareScrollView>
			<Text style={styles.title}>{teamName}</Text>

			<Text style={styles.error}>{editTeamError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editTeamFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de equipo"
				value={editTeamFormik.values.name}
			/>
			<Text style={styles.error}>{editTeamFormik.errors.name}</Text>
			<Button
				title="Cambiar nombre"
				onPress={editTeamFormik.handleSubmit}
				disabled={editTeamSubmitting}
			/>

			<Text style={styles.title}>Participantes</Text>
			<FlatList
				data={teamUsers}
				renderItem={({ item }) => <Text>{item.userName}</Text>}
				keyExtractor={(item) => item.userName}
			/>

			<Text style={styles.title}>Agregar participante</Text>

			<TextInput
				style={styles.input}
				onChangeText={(text) => setSelectedUsertoAdd(text)}
				placeholder="Nombre de usuario"
				value={selectedUsertoAdd || ""}
			/>
			<Button
				title="Agregar"
				onPress={addUser}
				disabled={editTeamSubmitting}
			/>

			<Text style={styles.title}>Remover participante</Text>

			<RNPickerSelect
				placeholder={{
					label: "Selecciona un usuario...",
					value: null,
					color: "#9EA0A4",
				}}
				items={teamUsers.map((user) => ({
					label: user.userName,
					value: user.userName,
				}))}
				onValueChange={(value) => setSelectedUsertoRemove(value)}
				style={{
					inputIOS: {
						fontSize: 16,
						paddingVertical: 12,
						paddingHorizontal: 10,
						borderWidth: 1,
						borderColor: "gray",
						borderRadius: 4,
						color: "black",
						paddingRight: 30,
					},
					inputAndroid: {
						fontSize: 16,
						paddingHorizontal: 10,
						paddingVertical: 8,
						borderWidth: 0.5,
						borderColor: "purple",
						borderRadius: 8,
						color: "black",
						paddingRight: 30,
					},
				}}
			/>
			<Button
				title="Quitar"
				onPress={removeUser}
				disabled={editTeamSubmitting}
			/>

			<Text style={styles.title}>Proyectos</Text>
			<FlatList
				data={projects}
				renderItem={({ item }) => (
					<TeamItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.name}
				scrollEnabled={false}
			/>

			<Text style={styles.error}>{newProjectError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					newProjectFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de proyecto"
				value={newProjectFormik.values.name}
			/>
			<Text style={styles.error}>{newProjectFormik.errors.name}</Text>
			<Button
				title="Crear proyecto"
				onPress={newProjectFormik.handleSubmit}
				disabled={editTeamSubmitting}
			/>

			<Button
				title="ELIMINAR EQUIPO"
				onPress={() => deleteTeam(teamId)}
				disabled={editTeamSubmitting}
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
