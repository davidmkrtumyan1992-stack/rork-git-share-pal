import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { darkTheme } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Не найдено" }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🔍</Text>
        <Text style={styles.title}>Страница не найдена</Text>
        <Text style={styles.subtitle}>Такой страницы не существует</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Вернуться на главную</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: darkTheme.colors.background,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: darkTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: darkTheme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  link: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    backgroundColor: darkTheme.colors.primary,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
