import { View, Text, StyleSheet } from "react-native";

export default function LeadCard({ lead }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{lead.name || "Unknown Lead"}</Text>
        <Text style={styles.badge}>NEW</Text>
      </View>

      <Text style={styles.detail}>✉ {lead.email || "No email"}</Text>
      <Text style={styles.detail}>☎ {lead.phone || "No phone"}</Text>

      <View style={styles.footer}>
        <Text style={styles.source}>{lead.source || "Meta Lead Ads"}</Text>
        <Text style={styles.time}>
          {lead.createdAt
            ? new Date(lead.createdAt).toLocaleTimeString()
            : "Just received"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  badge: {
    backgroundColor: "#DCFCE7",
    color: "#15803D",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: "700",
  },
  detail: {
    color: "#4B5563",
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  source: { color: "#2563EB", fontSize: 12, fontWeight: "600" },
  time: { color: "#9CA3AF", fontSize: 11 },
});