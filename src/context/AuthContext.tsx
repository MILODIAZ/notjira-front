import React, { useState, createContext } from "react";

export const AuthContext = createContext({
	user: undefined,
	login: () => {},
	logout: () => {},
	refreshPage: () => {},
});

type userDataType = {
	id: string;
	name: string;
	lastName: string;
	userName: string;
	password: string;
	email: string;
	jwt: string;
};

export function AuthProvider(props) {
	const { children } = props;
	const [auth, setAuth] = useState(undefined);
	const [refresh, setRefresh] = useState(true);

	const login = (userData: userDataType) => {
		setAuth(userData);
	};

	const logout = () => {
		setAuth(undefined);
	};

	const refreshPage = () => {
		setRefresh(!refresh);
	};

	const valueContext = {
		auth,
		login,
		logout,
		refresh,
		refreshPage,
	};

	return (
		<AuthContext.Provider value={valueContext}>
			{children}
		</AuthContext.Provider>
	);
}
