import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginForm from "./LoginForm";
import useAuth from "../../hooks/useAuth";
import { loginFetch } from "../../api/api.connection";

// Import navigation dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Use the real useAuth hook
jest.mock('../../hooks/useAuth');

// Use the real loginFetch function
jest.mock('../../api/api.connection', () => {
	const originalModule = jest.requireActual('../../api/api.connection');
	return {
		...originalModule,
		__esModule: true,
	};
});

describe("LoginForm", () => {
	let loginMock;
	let navigationMock;

	beforeEach(() => {
		loginMock = jest.fn();
		useAuth.mockReturnValue({ login: loginMock });
		navigationMock = { navigate: jest.fn(), reset: jest.fn() };
	});

	test("renders correctly and submits the form", () => {
		const { getByTestId, getByText } = render(
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="LoginForm" options={{ headerShown: false }}>
						{(props) => <LoginForm {...props} navigation={navigationMock} />}
					</Stack.Screen>
				</Stack.Navigator>
			</NavigationContainer>
		);

		// Verificar que los campos de texto y el botón estén presentes
		const usernameInput = getByTestId("userNameInput");
		const passwordInput = getByTestId("passwordInput");
		const loginButton = getByText("Ingresar");

		// Fill the form fields
		fireEvent.changeText(usernameInput, 'MiloSky');
		fireEvent.changeText(passwordInput, 'Zm361118*');

		// Submit the form
		fireEvent.press(loginButton);

		// Wait for the form submission to be processed
		waitFor(() => {
			expect(loginMock).toHaveBeenCalled();
			expect(navigationMock.navigate).toHaveBeenCalledWith('AppNavigation');
			expect(navigationMock.reset).toHaveBeenCalledWith({
				index: 0,
				routes: [{ name: 'AppNavigation' }],
			});
		});

		// Verificar que se ha navegado a AppNavigation buscando un elemento presente en dicha pantalla

		const appNavigationText = getByTestId("Tareas");
		expect(appNavigationText).toBeTruthy();
	});
});