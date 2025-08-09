import { View, Text, StyleSheet } from "react-native";
import AeroHeader from "@/components/AeroHeader";

export default function Index() {
  return (
    <View style={styles.page}>
      <AeroHeader />
      <View style={styles.body}>
        <Text style={styles.title}>Fleet page here ✅</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#0A0A0A" },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: "white", fontSize: 22, fontWeight: "600" },
});
