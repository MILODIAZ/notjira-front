import { FlatList, StyleSheet, LogBox } from "react-native";
import {
	Text,
	TextInput,
	Button,
	Divider,
	Card,
	Avatar,
} from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

type RootStackParamList = {
	EditTeam: {
		teamId: number;
		teamName: string;
		teamUsers: User[];
		teamProjects: Project[];
	};
	Management: undefined;
	EditProject: {
		teamId: number;
		projectId: number;
		projectName: string;
		projectTasks: Object[];
	};
};
type EditTeamScreenRouteProp = RouteProp<RootStackParamList, "EditTeam">;
type EditTeamScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"EditTeam"
>;
type EditTeamProps = {
	navigation: EditTeamScreenNavigationProp;
	route: EditTeamScreenRouteProp;
};

interface Project {
	id: number;
	name: string;
}

interface User {
	userName: string;
}

export default function EditTeam(props: EditTeamProps) {
	const { navigation } = props;
	const { refresh, refreshPage, auth } = useAuth();
	const route = useRoute();
	const routeParams = route.params as RootStackParamList["EditTeam"];
	const { teamId, teamName, teamUsers, teamProjects } = routeParams || {};

	const [projects, setProjects] = useState<Project[]>(teamProjects);
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
				if (auth?.jwt) {
					const response = await updateTeam(teamId, name, auth.jwt);
					console.log(response);
					if (response === true) {
						editTeamFormik.resetForm();
						console.log("here in editTeam");
						navigation.navigate("Management");
						refreshPage();
					} else {
						setEditTeamError("Nombre de equipo ya está utilizado");
					}
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
				if (auth?.jwt) {
					const response = await removeUserFromTeam(
						teamId,
						selectedUsertoRemove,
						auth.jwt
					);
					console.log(response);
					if (response === true) {
						navigation.navigate("Management");
						refreshPage();
					} else {
						setEditTeamError("No se pudo eliminar al participante");
					}
				} else {
					// Handle the case when auth is undefined
					setEditTeamError("Error de autenticación");
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
				if (auth?.jwt) {
					const response = await registerUserOnTeam(
						teamId,
						selectedUsertoAdd,
						auth.jwt
					);
					console.log(response);
					if (response.success === true) {
						navigation.navigate("Management");
						refreshPage();
					} else {
						setEditTeamError(`${response.error}`);
					}
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
			if (auth?.jwt) {
				const response = await removeTeam(id, auth.jwt);
				console.log(response);
				if (response === true) {
					navigation.navigate("Management");
					refreshPage();
				} else {
					setEditTeamError(`Error al eliminar equipo`);
				}
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
			if (auth?.jwt) {
				const projectData = await getProject(id, auth.jwt);
				const projectId = projectData.data.id;
				const projectName = projectData.data.name;
				const projectTasks = projectData.data.tasks;
				navigation.navigate("EditProject", {
					teamId: teamId,
					projectId: projectId,
					projectName: projectName,
					projectTasks: projectTasks,
				});
			}
		} catch (error) {
			console.error("Error al obtener proyecto:", error);
		}
	};

	const TeamItem = ({ title, id }: ItemProps) => (
		<Card mode="outlined">
			<Card.Title
				title={title}
				left={(props) => <Avatar.Icon {...props} icon="folder" />}
				titleVariant="headlineMedium"
			/>
			<Card.Actions>
				<Button onPress={() => goToProject(id)}>Editar</Button>
			</Card.Actions>
		</Card>
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
				if (auth?.jwt) {
					const response = await createProject(
						name,
						teamId,
						auth.jwt
					);
					console.log(response);
					if (response == true) {
						newProjectFormik.resetForm();
						setAuxNewProjectBoolean(!auxNewProjectBoolean);
					} else {
						setNewProjectError(
							"Nombre de proyecto ya está utilizado"
						);
					}
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
				if (auth?.jwt) {
					const teamData = await getTeam(teamId, auth.jwt);
					setProjects(teamData.data.projects);
					console.log(refresh);
				}
			} catch (error) {
				console.error("Error al obtener proyectos del equipo:", error);
			}
		};
		fetchTeamProjects();
	}, [auxNewProjectBoolean, refresh]);

	return (
		<KeyboardAwareScrollView style={{ paddingHorizontal: 8 }}>
			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginTop: 20,
					fontWeight: "bold",
				}}
			>
				{teamName}
			</Text>

			<Text style={styles.error}>{editTeamError}</Text>
			<TextInput
				label="Nuevo nombre"
				onChangeText={(text) =>
					editTeamFormik.setFieldValue("name", text)
				}
				placeholder={teamName}
				value={editTeamFormik.values.name}
			/>
			<Text style={styles.error}>{editTeamFormik.errors.name}</Text>
			<Button
				mode="contained"
				onPress={() => editTeamFormik.handleSubmit()}
				disabled={editTeamSubmitting}
				loading={editTeamSubmitting}
				style={{ borderRadius: 0 }}
			>
				Cambiar nombre
			</Button>
			<Divider bold={true} style={{ marginTop: 30, marginBottom: 30 }} />

			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginBottom: 20,
					fontWeight: "bold",
				}}
			>
				Participantes
			</Text>
			<FlatList
				data={teamUsers}
				renderItem={({ item }) => (
					<Card mode="outlined">
						<Card.Title
							title={item.userName}
							left={(props) => (
								<Avatar.Icon {...props} icon="account" />
							)}
							titleVariant="titleLarge"
						/>
					</Card>
				)}
				keyExtractor={(item) => item.userName}
			/>

			<Text
				variant="headlineSmall"
				style={{ marginLeft: 20, marginTop: 20 }}
			>
				Agregar participante
			</Text>

			<TextInput
				label="Nombre de usuario"
				onChangeText={(text) => setSelectedUsertoAdd(text)}
				placeholder="Nombre de usuario"
				value={selectedUsertoAdd || ""}
			/>
			<Button
				mode="contained"
				onPress={addUser}
				disabled={editTeamSubmitting}
				loading={editTeamSubmitting}
				style={{ borderRadius: 0 }}
			>
				Agregar
			</Button>

			<Text
				variant="headlineSmall"
				style={{ marginLeft: 20, marginTop: 20 }}
			>
				Remover participante
			</Text>

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
				mode="contained"
				onPress={removeUser}
				disabled={editTeamSubmitting}
				loading={editTeamSubmitting}
				style={{ borderRadius: 0 }}
			>
				Quitar
			</Button>

			<Divider bold={true} style={{ marginTop: 30, marginBottom: 30 }} />

			<Text
				variant="headlineLarge"
				style={{
					textAlign: "center",
					marginBottom: 20,
					fontWeight: "bold",
				}}
			>
				Proyectos
			</Text>
			<FlatList
				data={projects}
				renderItem={({ item }) => (
					<TeamItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.id.toString()}
				scrollEnabled={false}
			/>

			<Text style={styles.error}>{newProjectError}</Text>
			<TextInput
				label="Nombre de proyecto"
				onChangeText={(text) =>
					newProjectFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de proyecto"
				value={newProjectFormik.values.name}
			/>
			<Text style={styles.error}>{newProjectFormik.errors.name}</Text>
			<Button
				mode="contained"
				onPress={() => newProjectFormik.handleSubmit()}
				disabled={editTeamSubmitting}
				loading={editTeamSubmitting}
				style={{ borderRadius: 0 }}
			>
				Crear proyecto
			</Button>

			<Button
				mode="contained"
				onPress={() => deleteTeam(teamId)}
				disabled={editTeamSubmitting}
				loading={editTeamSubmitting}
				buttonColor="red"
				style={{ borderRadius: 0 }}
			>
				ELIMINAR EQUIPO
			</Button>
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
