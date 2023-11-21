import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { loginFetch } from "../../api/api.connection";

export default function LoginForm(props) {
	const { navigation } = props;

	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { login } = useAuth();

	const formik = useFormik({
		initialValues: initialValues(),
		validationSchema: Yup.object(validationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setError("");
			setIsSubmitting(true);
			const { username, password } = formValue;
			try {
				const response = await loginFetch(username, password);
				if (response.error) {
					setError("El usuario o la contraseña no son correctos");
				} else {
					login(response);
					navigation.navigate("AppNavigation");
					navigation.reset({
						index: 0,
						routes: [{ name: "AppNavigation" }],
					});
				}
			} catch (error) {
				setError("Error inesperado");
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return (
		<View>
			<Image
				source={require("../../assets/notjira-logo.png")}
				style={styles.logo}
			/>
			<Text style={styles.title}>Iniciar sesión</Text>
			<Text style={styles.error}>{error}</Text>
			<TextInput
				placeholder="Nombre de usuario"
				style={styles.input}
				autoCapitalize="none"
				value={formik.values.username}
				onChangeText={(text) => formik.setFieldValue("username", text)}
			/>
			<Text style={styles.error}>{formik.errors.username}</Text>
			<TextInput
				placeholder="Contraseña"
				style={styles.input}
				autoCapitalize="none"
				secureTextEntry={true}
				value={formik.values.password}
				onChangeText={(text) => formik.setFieldValue("password", text)}
			/>
			<Text style={styles.error}>{formik.errors.password}</Text>
			<Button
				title="Entrar"
				onPress={formik.handleSubmit}
				disabled={isSubmitting}
			/>
		</View>
	);
}

function initialValues() {
	return {
		username: "",
		password: "",
	};
}

function validationSchema() {
	return {
		username: Yup.string().required("El usuario es obligatorio"),
		password: Yup.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
			)
			.required("La contraseña es obligatoria"),
	};
}

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		fontSize: 28,
		fontWeight: "bold",
		marginTop: 0,
		marginBottom: 0,
	},
	input: {
		height: 40,
		marginHorizontal: 10,
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
	},
	error: {
		textAlign: "center",
		color: "#f00",
	},
	logo: {
		width: 300,
		height: 300,
		alignSelf: "center",
	},
});
