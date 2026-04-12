import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { darkTheme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getTranslation } from "@/data/translations";

export default function ModalScreen() {
  const { language } = useAuth();
  const t = getTranslation(language);

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t.app.title}</Text>
          <Text style={styles.description}>{t.app.subtitle}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
            testID="modal-close-button"
          >
            <Text style={styles.closeButtonText}>{t.common.cancel}</Text>
          </TouchableOpacity>
        </View>
      </Pressable>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: 24,
    padding: 28,
    margin: 20,
    alignItems: "center",
    minWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    marginBottom: 12,
    color: darkTheme.colors.text,
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    color: darkTheme.colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: darkTheme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 120,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600" as const,
    textAlign: "center",
    fontSize: 16,
  },
});
