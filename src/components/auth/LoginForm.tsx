import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { loginFetch } from "../../api/api.connection";

type RootStackParamList = {
	AppNavigation: undefined;
};
type LoginFormNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"AppNavigation"
>;

export type LoginProps = {
	navigation: LoginFormNavigationProp;
};

export default function LoginForm(props: LoginProps) {
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
		<View style={{ paddingHorizontal: 20 }}>
			<Image
				source={require("../../assets/notjira-logo.png")}
				style={styles.logo}
			/>
			<Text style={styles.title}>Iniciar sesión</Text>
			<Text style={styles.error}>{error}</Text>
			<TextInput
				testID="userNameInput"
				placeholder="Nombre de usuario"
				label="Nombre de usuario"
				autoCapitalize="none"
				value={formik.values.username}
				onChangeText={(text) => formik.setFieldValue("username", text)}
			/>
			<Text style={styles.error}>{formik.errors.username}</Text>
			<TextInput
				testID="passwordInput"
				placeholder="Contraseña"
				label="Contraseña"
				autoCapitalize="none"
				secureTextEntry={true}
				value={formik.values.password}
				onChangeText={(text) => formik.setFieldValue("password", text)}
			/>
			<Text style={styles.error}>{formik.errors.password}</Text>
			<Button
				mode="contained"
				onPress={() => formik.handleSubmit()}
				disabled={isSubmitting}
				loading={isSubmitting}
				style={{ borderRadius: 0 }}
			>
				Ingresar
			</Button>
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
