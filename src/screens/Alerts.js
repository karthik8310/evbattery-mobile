import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../config';

export default function Alerts() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/latest`);
      setData(res.data);
      setLoading(false);
      const aiml = res.data?.aiml || {};
      if (aiml.anomalies && aiml.anomalies.length > 0) {
        const newAlerts = aiml.anomalies.map(a => ({ id: Date.now() + Math.random(), text: a, severity: aiml.risk || 'HIGH', ts: res.data.timestamp }));
        setAlerts(prev => {
          const combined = [...newAlerts, ...prev];
          const seen = new Set();
          const unique = [];
          for (const a of combined) {
            const key = `${a.text}-${a.ts}`;
            if (!seen.has(key)) { seen.add(key); unique.push(a); }
          }
          return unique.slice(0, 200);
        });
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    intervalRef.current = setInterval(fetchLatest, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading && !data) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Alerts</Text>
        {alerts.length === 0 && <Text style={{ marginTop: 12 }}>No alerts yet.</Text>}
        {alerts.map(a => (
          <View style={styles.alertCard} key={a.id}>
            <Text style={{ fontWeight: '800' }}>{a.text}</Text>
            <Text style={{ color: '#666', marginTop: 6 }}>{new Date(a.ts).toLocaleString()}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800' },
  alertCard: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6 }
});
