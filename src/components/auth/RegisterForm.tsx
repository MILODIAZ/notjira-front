import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../../api/api.connection";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Register"
>;

export interface RegisterFormProps {
	navigation: RegisterScreenNavigationProp;
}

export default function RegisterForm(props: RegisterFormProps) {
	const { navigation } = props;
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const formik = useFormik({
		initialValues: initialValues(),
		validationSchema: Yup.object(validationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setError("");
			setIsSubmitting(true);
			const { name, lastName, username, password, email } = formValue;
			try {
				const response = await register(
					name,
					lastName,
					email,
					username,
					password
				);
				console.log(response.result1.error);
				if (response.result1.error) {
					setError("Nombre de usuario ya está utilizado");
				} else {
					formik.resetForm();
					navigation.navigate("Login");
					navigation.reset({
						index: 0,
						routes: [{ name: "Login" }],
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
		<View style={{ paddingHorizontal: 20 }}>
			<Text style={styles.title}>Registrarse</Text>
			<Text style={styles.success}>{successMessage}</Text>
			<Text style={styles.error}>{error}</Text>
			<TextInput
				placeholder="Nombre"
				label="Nombre"
				autoCapitalize="none"
				value={formik.values.name}
				onChangeText={(text) => formik.setFieldValue("name", text)}
			/>
			<Text style={styles.error}>{formik.errors.name}</Text>
			<TextInput
				placeholder="Apellido"
				label="Apellido"
				autoCapitalize="none"
				value={formik.values.lastName}
				onChangeText={(text) => formik.setFieldValue("lastName", text)}
			/>
			<Text style={styles.error}>{formik.errors.lastName}</Text>
			<TextInput
				placeholder="Nombre de usuario"
				label="Nombre de usuario"
				autoCapitalize="none"
				value={formik.values.username}
				onChangeText={(text) => formik.setFieldValue("username", text)}
			/>
			<Text style={styles.error}>{formik.errors.username}</Text>
			<TextInput
				placeholder="Contraseña"
				label="Contraseña"
				autoCapitalize="none"
				secureTextEntry={true}
				value={formik.values.password}
				onChangeText={(text) => formik.setFieldValue("password", text)}
			/>
			<Text style={styles.error}>{formik.errors.password}</Text>
			<TextInput
				placeholder="Email"
				label="Email"
				autoCapitalize="none"
				value={formik.values.email}
				onChangeText={(text) => formik.setFieldValue("email", text)}
			/>
			<Text style={styles.error}>{formik.errors.email}</Text>
			<Button
				mode="contained"
				onPress={() => formik.handleSubmit()}
				disabled={isSubmitting}
				loading={isSubmitting}
				style={{ borderRadius: 0 }}
			>
				Registrar
			</Button>
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
		password: Yup.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
				"La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
			)
			.required("La contraseña es obligatoria"),
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
	success: {
		textAlign: "center",
		color: "green",
	},
});
