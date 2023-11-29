import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	StatusBar,
	TextInput,
	Button,
	TouchableOpacity,
	LogBox,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import useAuth from "../hooks/useAuth";
import { getTeams } from "../api/api.connection";
import { getTeam } from "../api/api.connection";
import { createTeam } from "../api/api.connection";

export type RootStackParamList = {
	Management: undefined;
	EditTeam: {
		teamId: number;
		teamName: string;
		teamUsers: Object[];
		teamProjects: Object[];
	};
};
type ManagementNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ManagementRouteProp = RouteProp<RootStackParamList, "EditTeam">;

type ManagementProps = {
	navigation: ManagementNavigationProp;
	route: ManagementRouteProp;
};

interface TeamItem {
	id: number;
	name: string;
}

export default function Management(props: ManagementProps) {
	const { navigation } = props;
	const { refresh, auth } = useAuth();
	const [teams, setTeams] = useState<TeamItem[]>([]);
	const [newTeamSubmitting, setNewTeamSubmitting] = useState(false);
	const [newTeamError, setNewTeamError] = useState("");
	const [auxNewTeamBoolean, setAuxNewTeamBoolean] = useState(false);

	const newTeamFormik = useFormik({
		initialValues: newTeamInitialValues(),
		validationSchema: Yup.object(newTeamValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setNewTeamError("");
			setNewTeamSubmitting(true);
			const { name } = formValue;
			try {
				if (auth?.jwt) {
					const response = await createTeam(name, auth.jwt);
					console.log(response);
					if (response === true) {
						newTeamFormik.resetForm();
						setAuxNewTeamBoolean(!auxNewTeamBoolean);
					} else {
						setNewTeamError("Nombre de equipo ya está utilizado");
					}
				} else {
					setNewTeamError("Error de autenticación");
				}
			} catch (error) {
				setNewTeamError("Error inesperado");
			} finally {
				setNewTeamSubmitting(false);
			}
		},
	});

	function newTeamInitialValues() {
		return {
			name: "",
		};
	}

	function newTeamValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nombre del equipo"),
		};
	}

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				if (auth?.jwt) {
					const teamsData = await getTeams(auth.jwt);
					setTeams(teamsData.data);
					console.log(refresh);
				}
			} catch (error) {
				console.error("Error al obtener equipos:", error);
			}
		};
		fetchTeams();
	}, [auxNewTeamBoolean, refresh]);

	useEffect(() => {
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
	}, []);

	type ItemProps = { title: string; id: number };

	const goToTeam = async (id: number) => {
		setNewTeamSubmitting(true);
		try {
			if (auth?.jwt) {
				const teamData = await getTeam(id, auth.jwt);
				const teamId = teamData.data.id;
				const teamName = teamData.data.name;
				const teamUsers = teamData.data.users;
				const teamProjects = teamData.data.projects;
				navigation.navigate("EditTeam", {
					teamId: teamId,
					teamName: teamName,
					teamUsers: teamUsers,
					teamProjects: teamProjects,
				});
			}
		} catch (error) {
			console.error("Error al obtener equipo:", error);
		} finally {
			setNewTeamSubmitting(false);
		}
	};

	const TeamItem = ({ title, id }: ItemProps) => (
		<TouchableOpacity
			onPress={() => goToTeam(id)}
			disabled={newTeamSubmitting}
		>
			<View style={styles.item}>
				<Text style={styles.title}>{title}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView>
			<Text style={styles.title}>Equipos</Text>
			<FlatList
				data={teams}
				renderItem={({ item }) => (
					<TeamItem title={item.name} id={item.id} />
				)}
				keyExtractor={(item) => item.name}
			/>
			<Text style={styles.error}>{newTeamError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					newTeamFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de equipo"
				value={newTeamFormik.values.name}
			/>
			<Text style={styles.error}>{newTeamFormik.errors.name}</Text>
			<Button
				title="Crear equipo"
				onPress={() => newTeamFormik.handleSubmit()}
				disabled={newTeamSubmitting}
			/>
		</SafeAreaView>
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
});
