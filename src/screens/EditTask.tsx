import { Text, StyleSheet, TextInput, Button } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

import useAuth from "../hooks/useAuth";
import { updateTask, removeTask } from "../api/api.connection";

export default function EditTask(props) {
	const { navigation } = props;
	const route = useRoute();
	const { refreshPage } = useAuth();
	const { taskId, taskName, taskDescription } = route.params || {};

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
				const response = await updateTask(taskId, name, description);
				console.log(response);
				if (response == true) {
					editTaskFormik.values.name = name;
					editTaskFormik.values.description = description;
					setTask(name);
					console.log("here in editTask");
					refreshPage();
				} else {
					setEditTaskError("Nombre de proyecto ya está utilizado");
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
			const response = await removeTask(id);
			console.log(response);
			if (response == true) {
				navigation.navigate("Management");
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

	return (
		<KeyboardAwareScrollView>
			<Text style={styles.title}>{task}</Text>

			<Text style={styles.error}>{editTaskError}</Text>
			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editTaskFormik.setFieldValue("name", text)
				}
				placeholder="Nombre de tarea"
				value={editTaskFormik.values.name}
			/>
			<Text style={styles.error}>{editTaskFormik.errors.name}</Text>
			<TextInput
				style={styles.input}
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
				title="Guardar cambios"
				onPress={editTaskFormik.handleSubmit}
				disabled={editTaskSubmitting}
			/>

			<Button
				title="ELIMINAR TAREA"
				onPress={() => deleteTask(taskId)}
				disabled={editTaskSubmitting}
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
