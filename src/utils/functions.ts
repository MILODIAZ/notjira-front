export function getDate() {
	const fecha = new Date();

	const year = fecha.getFullYear();
	const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
	const day = fecha.getDate().toString().padStart(2, "0");
	const hours = fecha.getHours().toString().padStart(2, "0");
	const minutes = fecha.getMinutes().toString().padStart(2, "0");
	const seconds = fecha.getSeconds().toString().padStart(2, "0");

	const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	console.log(formattedDate);
	return formattedDate;
}
