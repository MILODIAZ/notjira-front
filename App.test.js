import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginForm from "./src/components/auth/LoginForm";
import { loginFetch } from "./src/api/api.connection";
import { AuthProvider } from "./src/context/AuthContext";

// Import navigation dependencies
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Use the real loginFetch function
jest.mock('./src/api/api.connection', () => {
	const originalModule = jest.requireActual('./src/api/api.connection');
	return {
		...originalModule,
		__esModule: true,
	};
});

describe("App", () => {
	test("renders correctly and submits the login form", () => {
		const navigation = {
			navigate: jest.fn(),
			reset: jest.fn(),
		};

		const { getByTestId, getByText } = render(
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="LoginForm" options={{ headerShown: false }}>
						{(props) => <AuthProvider> {/* Provide the real AuthProvider */}
							<LoginForm {...props} navigation={navigation} />
						</AuthProvider>}
					</Stack.Screen>
				</Stack.Navigator>
			</NavigationContainer>
		);

		// Verificar que los campos de texto y el botón estén presentes
		const usernameInput = getByTestId("userNameInput");
		const passwordInput = getByTestId("passwordInput");
		const loginButton = getByText("Ingresar");

		// Fill the form fields
		fireEvent.changeText(usernameInput, 'SolidSnake');
		fireEvent.changeText(passwordInput, 'Zm361118*');

		// Submit the form
		fireEvent.press(loginButton);
		waitFor(() => expect(loginFetch).toHaveBeenCalledTimes(1));

		// Wait for the form submission to be processed
		waitFor(() => {
			expect(navigation.navigate).toHaveBeenCalledWith('AppNavigation');
			expect(navigation.reset).toHaveBeenCalledWith({
				index: 0,
				routes: [{ name: 'AppNavigation' }],
			});
		});
	});
});
