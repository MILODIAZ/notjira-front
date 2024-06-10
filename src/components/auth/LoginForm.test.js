import React from "react";
import { render } from "@testing-library/react-native";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  test("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);

    // Verificar que los campos de texto y el botón estén presentes
    const usernameInput = getByPlaceholderText("Nombre de usuario");
    const passwordInput = getByPlaceholderText("Contraseña");
    const loginButton = getByText("Ingresar");

    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });
});
