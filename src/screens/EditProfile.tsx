import React from "react";
import { Alert, SafeAreaView, TextInput } from "react-native";
import { View, Text } from "react-native";
import { COLORS } from "../utils/theme";
import { Button } from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import { saveUserChanges } from "../api/api.connection";

const EditProfile = () => {
	const { auth } = useAuth();

	const [firstName, setFirstName] = useState(auth.name);
	const [lastName, setLastName] = useState(auth.lastName);
	const [userName, setUserName] = useState(auth.userName);

	const submitChanges = async () => {
		console.log(auth.userName);

		const data = await saveUserChanges(
			auth.userName,
			firstName,
			lastName,
			userName
		);
	};
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.white,
				paddingHorizontal: 22,
			}}
		>
			<Text>EditProfile</Text>
			<Text>First name</Text>
			<TextInput
				style={styles.textInputStyle}
				value={firstName}
				onChangeText={setFirstName}
			></TextInput>

			<Text>Last name</Text>
			<TextInput
				style={styles.textInputStyle}
				value={lastName}
				onChangeText={setLastName}
			></TextInput>
			<Text>User name</Text>
			<TextInput
				style={styles.textInputStyle}
				value={userName}
				onChangeText={setUserName}
			></TextInput>
			<Button title="Enviar cambios" onPress={submitChanges}></Button>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	textInputStyle: {
		borderWidth: 1,
		borderRadius: 4,
		paddingLeft: 10,
	},
});
export default EditProfile;
