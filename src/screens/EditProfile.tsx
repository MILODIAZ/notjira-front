import React from "react";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { Button } from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateUser } from "../api/api.connection";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import useAuth from "../hooks/useAuth";

export type RootStackParamList = {
	Profile: undefined;
	EditProfileScreen: { userId: string };
};

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"EditProfileScreen",
	"Profile"
>;

interface EditProfileProps {
	navigation: EditProfileScreenNavigationProp;
}

export default function EditProfile(props: EditProfileProps) {
	const { navigation } = props;
	const { refreshPage, auth, login } = useAuth();

	const [editProfileSubmitting, setEditTaskSubmitting] = useState(false);
	const [editProfileError, setEditTaskError] = useState("");

	function editProfileInitialValues() {
		return {
			name: auth?.name,
			lastName: auth?.lastName,
			userName: auth?.userName,
			email: auth?.email,
		};
	}

	function editProfileValidationSchema() {
		return {
			name: Yup.string().required("Escriba el nuevo nombre"),
			lastName: Yup.string().required("Escriba el nuevo apellido"),
			userName: Yup.string().required(
				"Escriba el nuevo nombre de usuario"
			),
			email: Yup.string().required("Escriba el nuevo correo"),
		};
	}

	const editProfileFormik = useFormik({
		initialValues: editProfileInitialValues(),
		validationSchema: Yup.object(editProfileValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setEditTaskError("");
			setEditTaskSubmitting(true);
			const { name, lastName, userName, email } = formValue;
			try {
				if (auth?.jwt && userName && name && lastName && email) {
					const response = await updateUser(
						auth.userName,
						userName,
						name,
						lastName,
						email,
						auth.jwt
					);
					console.log(response.result1.error);
					if (response.result1.error) {
						setEditTaskError("Nombre de usuario ya está utilizado");
					} else {
						editProfileFormik.values.name = name;
						editProfileFormik.values.lastName = lastName;
						editProfileFormik.values.userName = userName;
						editProfileFormik.values.email = email;
						const userData = {
							id: auth.id,
							name: name?.toString(),
							lastName: lastName?.toString(),
							userName: userName?.toString(),
							password: auth.password,
							email: email?.toString(),
							jwt: auth.jwt,
						};
						login(userData);
						navigation.navigate("Profile");
						refreshPage();
					}
				}
			} catch (error) {
				setEditTaskError("Error inesperado");
			} finally {
				setEditTaskSubmitting(false);
			}
		},
	});

	return (
		<KeyboardAwareScrollView>
			<Text style={styles.error}>{editProfileError}</Text>

			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editProfileFormik.setFieldValue("name", text)
				}
				placeholder="Nombre"
				value={editProfileFormik.values.name}
			/>
			<Text style={styles.error}>{editProfileFormik.errors.name}</Text>

			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editProfileFormik.setFieldValue("lastName", text)
				}
				placeholder="Apellido"
				value={editProfileFormik.values.lastName}
			/>
			<Text style={styles.error}>
				{editProfileFormik.errors.lastName}
			</Text>

			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editProfileFormik.setFieldValue("userName", text)
				}
				placeholder="Nombre de usuario"
				value={editProfileFormik.values.userName}
			/>
			<Text style={styles.error}>
				{editProfileFormik.errors.userName}
			</Text>

			<TextInput
				style={styles.input}
				onChangeText={(text) =>
					editProfileFormik.setFieldValue("email", text)
				}
				placeholder="Email"
				value={editProfileFormik.values.email}
			/>
			<Text style={styles.error}>{editProfileFormik.errors.email}</Text>

			<Button
				title="Enviar cambios"
				onPress={() => editProfileFormik.handleSubmit()}
				disabled={editProfileSubmitting}
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
