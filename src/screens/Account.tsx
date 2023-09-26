import { Text, View } from "react-native";
import React from "react";
import LoginForm from "../components/auth/LoginForm";
import UserData from "../components/auth/UserData";
import useAuth from "../hooks/useAuth";

export default function AccountScreen() {
	const { auth } = useAuth();
	return <View>{auth ? <UserData /> : <LoginForm />}</View>;
}
