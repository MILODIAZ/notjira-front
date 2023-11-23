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

export async function getUserInfo(userId: number) {
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

export async function getTeams() {
	try {
		const url = `${API_HOST}/team`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function getTeam(id: number) {
	try {
		const url = `${API_HOST}/team/${id}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function createTeam(name: string) {
	try {
		const url = `${API_HOST}/team`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Equipo guardado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function updateTeam(id: number, name: string) {
	try {
		const url = `${API_HOST}/team/${id}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Equipo actualizado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeTeam(id: number) {
	try {
		const url = `${API_HOST}/team/${id}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Equipo eliminado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function registerUserOnTeam(id: number, userName: string) {
	console.log("nombre ", userName);
	console.log("id ", id);

	try {
		const url = `${API_HOST}/team/add/${id}?userName=${userName}`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
			return data;
		} else {
			console.log("Participante agregado con éxito");
			return data;
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeUserFromTeam(id: number, userName: string) {
	try {
		const url = `${API_HOST}/team/remove/${id}?userName=${userName}`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Participante eliminado con éxito");
			return data.success;
		}
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function getProject(id: number) {
	try {
		const url = `${API_HOST}/project/${id}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function createProject(name: string, teamId: number) {
	try {
		const url = `${API_HOST}/project`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				teamId,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Proyecto guardado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function updateProject(id: number, name: string) {
	try {
		const url = `${API_HOST}/project/${id}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Proyecto actualizado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeProject(id: number) {
	try {
		const url = `${API_HOST}/project/${id}`;
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Proyecto eliminado con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function getTask(id: number) {
	try {
		const url = `${API_HOST}/task/${id}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function createTask(
	projectId: number,
	creatorUser: string,
	name: string,
	description: string
) {
	try {
		const url = `${API_HOST}/task`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				creatorUser,
				projectId,
				description,
			}),
		});

		const data = await response.json();

		console.log(data);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Tarea guardada con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function updateTask(
	id: number,
	name: string,
	description: string
) {
	try {
		const url = `${API_HOST}/task/${id}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				description,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Tarea actualizada con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function removeTask(id: number) {
	try {
		const url = `${API_HOST}/task/${id}`;
		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				deleted: true,
			}),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success == false) {
			console.log("Hubo un error");
		} else {
			console.log("Tarea eliminada con éxito");
		}
		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function getTasks(filterResponsable: string) {
	try {
		const url = `${API_HOST}/task/getTask`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Error de red:", error);
	}
}

export async function taskStatus(
	id: number,
	status: string,
	date: string,
	init: boolean,
	responsableUser: string
) {
	console.log(id);
	console.log(status);
	console.log(date);
	console.log(init);
	console.log(responsableUser);
	try {
		const url = `${API_HOST}/task/${id}`;

		const requestBody = init
			? { status, responsableUser, startDate: date }
			: { status, responsableUser, endDate: date };

		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();

		console.log(data.success);

		if (data.success === false) {
			console.log("Hubo un error");
		} else {
			console.log("Tarea actualizada con éxito");
		}

		return data.success;
	} catch (error) {
		console.error("Error de red:", error);
	}
}
