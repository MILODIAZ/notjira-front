import { StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import useAuth from "../hooks/useAuth";
import { updateTask, removeTask } from "../api/api.connection";

type RootStackParamList = {
	EditTask: {
		taskId: number;
		taskName: string;
		taskDescription: string;
	};
	Management: undefined;
};

type EditTaskScreenRouteProp = RouteProp<RootStackParamList, "EditTask">;
type EditTaskScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"EditTask"
>;

type EditTaskProps = {
	navigation: EditTaskScreenNavigationProp;
	route: EditTaskScreenRouteProp;
};

export default function EditTask(props: EditTaskProps) {
	const { navigation } = props;
	const route = useRoute();
	const { refreshPage, auth } = useAuth();
	const routeParams = route.params as RootStackParamList["EditTask"];
	const { taskId, taskName, taskDescription } = routeParams || {};

	const [task, setTask] = useState(taskName);
	const [editTaskSubmitting, setEditTaskSubmitting] = useState(false);
	const [editTaskError, setEditTaskError] = useState("");

	function editTaskInitialValues() {
		return {
			name: taskName,
			description: taskDescription,
		};
	}

	function editTaskValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nuevo nombre del proyecto"),
			description: Yup.string().required(
				"Escriba la nueva descripción del proyecto"
			),
		};
	}

	const editTaskFormik = useFormik({
		initialValues: editTaskInitialValues(),
		validationSchema: Yup.object(editTaskValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setEditTaskError("");
			setEditTaskSubmitting(true);
			const { name, description } = formValue;
			try {
				if (auth?.jwt) {
					const response = await updateTask(
						taskId,
						name,
						description,
						auth.jwt
					);
					console.log(response);
					if (response === true) {
						editTaskFormik.values.name = name;
						editTaskFormik.values.description = description;
						setTask(name);
						console.log("here in editTask");
						refreshPage();
					} else {
						setEditTaskError(
							"Nombre de proyecto ya está utilizado"
						);
					}
				}
			} catch (error) {
				setEditTaskError("Error inesperado");
			} finally {
				setEditTaskSubmitting(false);
			}
		},
	});

	async function deleteTask(id: number) {
		setEditTaskSubmitting(true);
		try {
			if (auth?.jwt) {
				const response = await removeTask(id, auth.jwt);
				console.log(response);
				if (response === true) {
					navigation.navigate("Management");
					refreshPage();
				} else {
					setEditTaskError(`Error al eliminar tarea`);
				}
			}
		} catch (error) {
			setEditTaskError("Error inesperado");
		} finally {
			setEditTaskSubmitting(false);
		}
	}

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
				{task}
			</Text>

			<Text style={styles.error}>{editTaskError}</Text>
			<TextInput
				label="Nombre de la tarea"
				onChangeText={(text) =>
					editTaskFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de tarea"
				value={editTaskFormik.values.name}
			/>
			<Text style={styles.error}>{editTaskFormik.errors.name}</Text>
			<TextInput
				label="Descripción de tarea"
				onChangeText={(text) =>
					editTaskFormik.setFieldValue("description", text)
				}
				placeholder="Descripción de tarea"
				value={editTaskFormik.values.description}
			/>
			<Text style={styles.error}>
				{editTaskFormik.errors.description}
			</Text>
			<Button
				mode="contained"
				onPress={() => editTaskFormik.handleSubmit()}
				disabled={editTaskSubmitting}
				loading={editTaskSubmitting}
				style={{ borderRadius: 0 }}
			>
				Guardar cambios
			</Button>

			<Button
				mode="contained"
				onPress={() => deleteTask(taskId)}
				disabled={editTaskSubmitting}
				loading={editTaskSubmitting}
				buttonColor="red"
				style={{ borderRadius: 0 }}
			>
				ELIMINAR TAREA
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
