import { useTheme } from "@/theme/theme";
import { StyleSheet, Text, View } from "react-native";

export default function BudgetHeader() {
	const theme = useTheme();

	return (
		<View style={styles.budgetHeader}>
			<View style={styles.budgetInfo}>
				<Text style={[styles.budgetTitle, { color: theme.colors.primaryText }]}>
					Budget
				</Text>

				<Text
					style={[
						styles.budgetSubtitle,
						{ color: theme.colors.secondaryText }
					]}
				>
					Set your price ceiling
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	budgetHeader: {
		paddingHorizontal: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	budgetInfo: {
		flex: 1,
	},

	budgetTitle: {
		fontSize: 18,
		fontWeight: "700",
	},

	budgetSubtitle: {
		marginTop: 2,
		fontSize: 14,
	},
});