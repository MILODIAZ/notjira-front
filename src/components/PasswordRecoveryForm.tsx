import { Text, TextInput, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { recoverPassword } from "../api/api.connection";

export default function PasswordRecoveryForm() {
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const formik = useFormik({
		initialValues: initialValues(),
		validationSchema: Yup.object(validationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setError("");
			setIsSubmitting(true);
			const { username } = formValue;
			try {
				const response = await recoverPassword(username);
				if (response.error) {
					setError("Usuario no registrado");
				} else {
					console.log(response);
				}
			} catch (error) {
				setError("Error inesperado");
			} finally {
				setIsSubmitting(false);
			}
		},
	});
	return (
		<View style={{ paddingHorizontal: 20 }}>
			<Text style={styles.title}>Recuperar contraseña</Text>
			<Text style={styles.error}>{error}</Text>
			<TextInput
				placeholder="Nombre de usuario"
				label="Nombre de usuario"
				autoCapitalize="none"
				value={formik.values.username}
				onChangeText={(text) => formik.setFieldValue("username", text)}
			/>
			<Text style={styles.error}>{formik.errors.username}</Text>
			<Button
				mode="contained"
				onPress={() => formik.handleSubmit()}
				disabled={isSubmitting}
				loading={isSubmitting}
				style={{ borderRadius: 0 }}
			>
				Solicitar clave de recuperación
			</Button>
		</View>
	);
}

function initialValues() {
	return {
		username: "",
	};
}

function validationSchema() {
	return {
		username: Yup.string().required("El usuario es obligatorio"),
	};
}

const styles = StyleSheet.create({
	title: {
		textAlign: "center",
		fontSize: 28,
		fontWeight: "bold",
		marginTop: 50,
		marginBottom: 15,
	},
	input: {
		height: 40,
		marginHorizontal: 12,
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
	},
	error: {
		textAlign: "center",
		color: "#f00",
	},
});
