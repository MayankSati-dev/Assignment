
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import LeadCard from "../src/components/LeadCard";
import { socket } from "../src/service/socket";

const API_URL = "https://assignment-95mr.onrender.com/api/leads";

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let mounted = true;

   
const fetchExistingLeads = async () => {
  try {
    setLoading(true);
    setFetchError("");

    const response = await fetch(
      "https://assignment-95mr.onrender.com/api/leads"
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch leads");
    }

    if (!Array.isArray(result)) {
      throw new Error("API response is not an array");
    }

    console.log("Existing leads received:", result.length);

    setLeads(result);
  } catch (error) {
    console.error("Fetch existing leads error:", error.message);
    setFetchError(error.message);
  } finally {
    setLoading(false);
  }
};


    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleNewLead = (lead) => {
      setLeads((previous) => {
        const leadId = lead.meta_lead_id || lead.id;

        if (
          leadId &&
          previous.some(
            (item) => (item.meta_lead_id || item.id) === leadId
          )
        ) {
          return previous;
        }

        return [
          {
            ...lead,
            id: lead.id || lead.meta_lead_id || `${Date.now()}`,
          },
          ...previous,
        ];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_lead", handleNewLead);

    // Load old leads and listen for new ones at the same time.
    fetchExistingLeads();
    socket.connect();

    return () => {
      mounted = false;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("new_lead", handleNewLead);
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusCard}>
        <View
          style={[
            styles.dot,
            { backgroundColor: connected ? "#22C55E" : "#EF4444" },
          ]}
        />

        <Text style={styles.statusText}>
          {connected ? "Connected" : "Disconnected"}
        </Text>

        <View style={{ flex: 1 }} />

        <Text style={styles.count}>{leads.length} leads</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent submissions</Text>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.emptyText}>Loading existing leads...</Text>
        </View>
      )}

      {!!fetchError && (
        <Text style={styles.errorText}>{fetchError}</Text>
      )}

      <FlatList
        data={leads}
        keyExtractor={(item, index) =>
          String(item.meta_lead_id || item.id || index)
        }
        renderItem={({ item }) => <LeadCard lead={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>↗</Text>
              <Text style={styles.emptyTitle}>
                {fetchError ? "Unable to load leads" : "Waiting for leads"}
              </Text>
              <Text style={styles.emptyText}>
                {fetchError
                  ? "Check your backend API and try again."
                  : "Existing leads and new submissions will appear here."}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 15,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 9,
  },
  statusText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
  count: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 14,
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  empty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyIcon: {
    fontSize: 36,
    color: "#2563EB",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 10,
  },
});
