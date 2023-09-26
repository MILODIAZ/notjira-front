import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Button,
	Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RegisterForm() {
	const [error, setError] = useState("");

	const formik = useFormik({
		initialValues: initialValues(),
		validationSchema: Yup.object(validationSchema()),
		validateOnChange: false,
		onSubmit: (formValue) => {
			setError("");
			const { name, lastName, username, password, email } = formValue;
			console.log(formValue);
		},
	});

	return (
		<View>
			<Text style={styles.title}>Registrarse</Text>
			<Text style={styles.error}>{error}</Text>
			<TextInput
				placeholder="Nombre"
				style={styles.input}
				autoCapitalize="none"
				value={formik.values.name}
				onChangeText={(text) => formik.setFieldValue("name", text)}
			/>
			<Text style={styles.error}>{formik.errors.name}</Text>
			<TextInput
				placeholder="Apellido"
				style={styles.input}
				autoCapitalize="none"
				value={formik.values.lastName}
				onChangeText={(text) => formik.setFieldValue("lastName", text)}
			/>
			<Text style={styles.error}>{formik.errors.lastName}</Text>
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
			<TextInput
				placeholder="Email"
				style={styles.input}
				autoCapitalize="none"
				value={formik.values.email}
				onChangeText={(text) => formik.setFieldValue("email", text)}
			/>
			<Text style={styles.error}>{formik.errors.email}</Text>
			<Button title="Registrar" onPress={formik.handleSubmit} />
		</View>
	);
}

function initialValues() {
	return {
		name: "",
		lastName: "",
		username: "",
		password: "",
		email: "",
	};
}

function validationSchema() {
	return {
		username: Yup.string().required("El usuario es obligatorio"),
		password: Yup.string().required("La contraseña es obligatoria"),
		/*password: Yup.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
			)
			.required("La contraseña es obligatoria"),*/
		name: Yup.string().required("El nombre es obligatorio"),
		lastName: Yup.string().required("El apellido es obligatorio"),
		email: Yup.string()
			.email("Ingresa un correo electrónico válido")
			.required("El correo es obligatorio"),
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
