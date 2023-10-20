import { Text } from "react-native";
import { StyleSheet } from "react-native/Libraries/StyleSheet/StyleSheet";
import theme from "../utils/theme";

const styles = StyleSheet.create({
	text: {
		color: theme.colors.textPrimary,
		fontSize: theme.fontSizes.body,
		fontFamily: theme.fonts.main,
		// fontWeight: theme.fontWeights.normal,
	},
	bold: {
		fontWeight: "bold",
	},
	blue: {
		color: "blue",
	},
	big: {
		fontSize: 20,
	},
	small: {
		fontSize: 10,
	},
});

export default function StyledText({ blue, bold, children, big, small }) {
	const textStyles = [
		styles.text,
		blue && styles.blue,
		big && styles.big,
		small && styles.small,
		bold && styles.bold,
	];
	return <Text style={textStyles}>{children}</Text>;
}
