import { API_HOST } from "../utils/constants";

export async function loginFetch(userName: string, password: string) {
	try {
		const url = `${API_HOST}/user/login`;
		const requestBody = JSON.stringify({ userName, password });
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: requestBody,
		});
		const result = await response.json();
		return result;
	} catch (error) {
		throw error;
	}
}

export async function register(
	name: string,
	lastName: string,
	email: string,
	userName: string,
	password: string
) {
	try {
		const url = `${API_HOST}/user`;
		const requestBody = JSON.stringify({
			name,
			lastName,
			email,
			userName,
			password,
		});
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
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
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: requestBody,
		});
		const result = await response.json();
		return result;
	} catch (error) {
		throw error;
	}
}

export async function getUserInfo(userId) {
	try {
		const url = `${API_HOST}/user/${userId}`;
		const response = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		const result = await response.json();
		return result;
	} catch (error) {
		throw error;
	}
}

export async function saveUserChanges(
	currentUserName: string,
	name: string,
	lastName: string,
	userName: string
) {
	try {
		const url = `${API_HOST}/user/${currentUserName}`;
		const requestBody = JSON.stringify({
			name,
			lastName,
			userName,
		});
		console.log(requestBody);
		const respuesta = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: requestBody,
		});
		console.log(respuesta);
		if (respuesta.ok) {
			console.log("Datos de usuario guardados con éxito");
		} else {
			console.error("Error al enviar datos de usuario al backend");
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function registerTeam(name: string) {
	try {
		const url = `${API_HOST}/team`;
		const respuesta = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
			}),
		});

		const data = await respuesta.json();

		console.log(respuesta);

		if (respuesta.status !== 201) {
			console.log("Hubo un error: " + respuesta.status + data.message);
		} else {
			console.log("Datos de usuario guardados con éxito");
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeTeam(id: string) {
	try {
		const url = `${API_HOST}/team/${id}`;
		const respuesta = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
			}),
		});

		const data = await respuesta.json();

		console.log(respuesta);

		if (respuesta.status !== 201) {
			console.log("Hubo un error: " + respuesta.status + data.message);
		} else {
			console.log("Datos de usuario guardados con éxito");
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function registerUserOnTeam(id: string, userName: string) {
	console.log("nombre ", userName);
	console.log("id ", id);

	try {
		const url = `${API_HOST}/team/add/${id}?userName=${userName}`;
		const respuesta = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await respuesta.json();

		console.log(respuesta);

		if (respuesta.status !== 201) {
			console.log("Hubo un error: " + respuesta.status + data.message);
		} else {
			console.log("Datos de usuario guardados con éxito");
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeUserFromTeam(id: string, userName: string) {
	console.log("nombre ", userName);
	console.log("id ", id);

	try {
		const url = `${API_HOST}/team/remove/${id}?userName=${userName}`;
		const respuesta = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await respuesta.json();

		console.log(respuesta);

		if (respuesta.status !== 201) {
			console.log("Hubo un error: " + respuesta.status + data.message);
		} else {
			console.log("Datos de usuario guardados con éxito");
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}
