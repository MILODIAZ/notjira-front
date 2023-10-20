import { Alert } from "react-native";
import { Button, View } from "react-native";

const TeamActionBar = () => {
	const showAlert = () => {
		Alert.alert("Boton presionado");
	};

	return (
		<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
			<Button title="Editar Integrantes" onPress={showAlert}></Button>
		</View>
	);
};

export default TeamActionBar;
