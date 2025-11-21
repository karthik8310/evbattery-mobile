import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import StatCard from "../components/StatCard";
import { API_BASE } from "../config";

export default function AIML() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/latest`);
      setData(res.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    intervalRef.current = setInterval(fetchLatest, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const aiml = data?.aiml || {};
  if (loading && !data)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>AIML Predictions</Text>

        <View style={styles.row}>
          <StatCard label="Risk" value={aiml.risk ?? "--"} />
          <StatCard label="Fire Risk" value={aiml.fireRisk ?? "--"} />
        </View>

        <View style={styles.row}>
          <StatCard label="Charging" value={aiml.charging ? "Yes" : "No"} />
          <StatCard label="Health Score" value={aiml.healthScore ?? "--"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Battery Health</Text>
          <Text style={styles.cardText}>{aiml.batteryHealthPred ?? "--"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.cardText}>{aiml.summary ?? "—"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Anomalies</Text>
          {aiml.anomalies && aiml.anomalies.length > 0 ? (
            aiml.anomalies.map((a, i) => (
              <Text key={i} style={styles.cardText}>
                • {a}
              </Text>
            ))
          ) : (
            <Text style={styles.cardText}>No anomalies</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardTitle: { fontWeight: "800" },
  cardText: { color: "#333", marginTop: 4 },
});
