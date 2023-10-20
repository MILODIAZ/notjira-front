import { View, Text, StyleSheet, Button } from "react-native";
import { removeUserFromTeam } from "../api/api.connection";
const UserItem = (props) => {
	const removeUser = async () => {
		await removeUserFromTeam(props.id, props.userName);
	};
	return (
		<View>
			<Text key={props.id}>{props.userName}</Text>
			<View style={styles.editBtn}>
				<Button title="desvincular" onPress={removeUser}></Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		backgroundColor: "lightblue",
		padding: 60,
		marginHorizontal: 30,
		marginBottom: 70,
	},
	editBtn: {
		width: 150,
		margin: 10,
		padding: 10,
	},
	textInputStyle: {
		borderWidth: 1,
		borderRadius: 4,
		paddingLeft: 10,
	},
});

export default UserItem;
