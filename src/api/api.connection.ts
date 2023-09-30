import { API_HOST } from "../utils/constants";

export async function loginFetch(userName: string, password: string) {
    try {
        const url = `${API_HOST}/user/login`;
        const requestBody = JSON.stringify({ userName, password });
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: requestBody,
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function register(name: string, lastName: string, email: string, userName: string, password: string) {
    try {
        const url = `${API_HOST}/user`;
        const requestBody = JSON.stringify({ name, lastName, email, userName, password });
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: requestBody,
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function recoverPassword(userName: string) {
    try {
        const url = `${API_HOST}/user/password`;
        const requestBody = JSON.stringify({ userName });
        const response = await fetch(url, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', },
            body: requestBody,
        });
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}