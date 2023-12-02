import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	FlatList,
	TextInput,
	Button,
} from "react-native";
import React, { useState } from "react";
import * as Yup from "yup";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useFormik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import useAuth from "../hooks/useAuth";
import { Comment } from "./Tasks";
import { createComment } from "../api/api.connection";

type TaskRouteParams = {
	taskId: number;
	taskName: string;
	taskCreator: string;
	taskResponsable: string;
	taskStart: string;
	taskEnd: string;
	taskDescription: string;
	taskProject: string;
	taskComments: Comment[];
};

type RootStackParamList = {
	Tasks: undefined;
	Task: {
		taskId: number;
		taskName: string;
		taskCreator: string;
		taskResponsable: string;
		taskStart: string;
		taskEnd: string;
		taskDescription: string;
		taskProject: string;
		taskComments: Comment[];
	};
};

type TaskScreenRouteProp = RouteProp<RootStackParamList, "Task">;
type TaskScreenNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"Task"
>;

type TaskProps = {
	navigation: TaskScreenNavigationProp;
	route: TaskScreenRouteProp;
};

export default function Task(props: TaskProps) {
	const { navigation } = props;
	const { refresh, auth, refreshPage } = useAuth();
	const route =
		useRoute<RouteProp<Record<string, TaskRouteParams>, string>>();

	const [newCommentError, setNewCommentError] = useState("");
	const [newCommentSubmitting, setNewCommentSubmitting] = useState(false);

	const {
		taskId,
		taskName,
		taskCreator,
		taskResponsable,
		taskStart,
		taskEnd,
		taskDescription,
		taskProject,
		taskComments,
	} = route.params || {};

	const [comments, setComments] = useState<Comment[]>(taskComments);

	type ItemProps = { content: string };

	const CommentItem = ({ content }: ItemProps) => (
		<ItemMenu title="" text={content} />
	);

	function newCommentInitialValues() {
		return {
			comment: "",
		};
	}

	function newTeamValidationSchema() {
		return {
			comment: Yup.string().required("Escriba el comentario"),
		};
	}

	const newCommentFormik = useFormik({
		initialValues: newCommentInitialValues(),
		validationSchema: Yup.object(newTeamValidationSchema()),
		validateOnChange: false,
		onSubmit: async (formValue) => {
			setNewCommentError("");
			setNewCommentSubmitting(true);
			const { comment } = formValue;
			try {
				if (auth?.jwt) {
					const response = await createComment(
						comment,
						auth.userName,
						taskId,
						auth.jwt
					);
					console.log(response);
					if (response === true) {
						navigation.navigate("Tasks");
						refreshPage();
					} else {
						setNewCommentError("Error");
					}
				} else {
					setNewCommentError("Error de autenticación");
				}
			} catch (error) {
				setNewCommentError("Error inesperado");
			} finally {
				setNewCommentSubmitting(false);
			}
		},
	});

	return (
		<KeyboardAwareScrollView>
			<View style={styles.content}>
				<View style={styles.titleBlock}>
					<Text style={styles.title}>{taskName}</Text>
				</View>

				<View style={styles.dataContent}>
					<ItemMenu title="Proyecto:" text={taskProject} />
					<ItemMenu title="Creado por:" text={taskCreator} />
					<ItemMenu title="Responsable:" text={taskResponsable} />
					<ItemMenu
						title="Fecha de inicio:"
						text={taskStart.replace("T", " ").substring(0, 19)}
					/>
					<ItemMenu
						title="Fecha de finalización:"
						text={taskEnd.replace("T", " ").substring(0, 19)}
					/>
					<ItemMenu title="Descripción:" text={taskDescription} />
				</View>

				<View style={styles.titleBlock}>
					<Text style={styles.title}>Comentarios</Text>
				</View>
				<FlatList
					data={comments}
					renderItem={({ item }) => (
						<CommentItem content={item.content} />
					)}
					keyExtractor={(item) => item.id.toString()}
				/>

				<Text style={styles.error}>{newCommentError}</Text>
				<TextInput
					style={styles.input}
					onChangeText={(text) =>
						newCommentFormik.setFieldValue("comment", text)
					}
					placeholder="Comentario"
					value={newCommentFormik.values.comment}
				/>
				<Text style={styles.error}>
					{newCommentFormik.errors.comment}
				</Text>
				<Button
					title="Agregar comentario"
					onPress={() => newCommentFormik.handleSubmit()}
					disabled={newCommentSubmitting}
				/>
			</View>
		</KeyboardAwareScrollView>
	);
}

function ItemMenu(props: { title: string; text: string }) {
	const { title, text } = props;
	return (
		<View style={styles.itemMenu}>
			<Text style={styles.itemMenuTitle}>{title}</Text>
			<Text>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	error: {
		textAlign: "center",
		color: "#f00",
	},
	content: {
		marginHorizontal: 20,
		marginTop: 20,
	},
	titleBlock: {
		marginBottom: 30,
	},
	title: {
		fontWeight: "bold",
		fontSize: 22,
	},
	dataContent: {
		marginBottom: 20,
	},
	itemMenu: {
		flexDirection: "row",
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderColor: "#CFCFCF",
	},
	itemMenuTitle: {
		fontWeight: "bold",
		paddingRight: 10,
		width: 120,
	},
	btonLogout: {
		paddingTop: 20,
	},
	editBtn: {
		marginTop: 10,
	},
});
