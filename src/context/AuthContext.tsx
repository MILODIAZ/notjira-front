import React, { useState, createContext, ReactNode } from "react";

type AuthProviderProps = {
	children: ReactNode;
};

interface AuthContextValue {
	auth: userDataType | undefined;
	login: (userData: userDataType | undefined) => void;
	logout: () => void;
	refreshPage: () => void;
	refresh: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
	auth: undefined,
	login: () => {},
	logout: () => {},
	refreshPage: () => {},
	refresh: false,
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

export function AuthProvider(props: AuthProviderProps) {
	const { children } = props;
	const [auth, setAuth] = useState<userDataType | undefined>(undefined);
	const [refresh, setRefresh] = useState(true);

	const login = (userData: userDataType | undefined) => {
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
