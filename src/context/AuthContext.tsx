import React, { useState, createContext } from "react";

export const AuthContext = createContext({
	user: undefined,
	login: () => {},
	logout: () => {},
});

type userDataType = {
	id: string;
	name: string;
	lastName: string;
	userName: string;
	password: string;
	email: string;
};

export function AuthProvider(props) {
	const { children } = props;
	const [auth, setAuth] = useState(undefined);

	const login = (userData: userDataType) => {
		setAuth(userData);
	};

	const logout = () => {
		setAuth(undefined);
	};

	const valueContext = {
		auth,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={valueContext}>
			{children}
		</AuthContext.Provider>
	);
}
