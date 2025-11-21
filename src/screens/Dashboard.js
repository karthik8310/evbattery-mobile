import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import StatCard from '../components/StatCard';
import { API_BASE } from '../config';

export default function Dashboard({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const fetchLatest = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/latest`);
      setData(res.data);
      setLoading(false);
      setHistory(prev => {
        const next = [res.data, ...prev];
        return next.slice(0, 200);
      });
    } catch (err) {
      console.warn('Fetch error', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
    intervalRef.current = setInterval(fetchLatest, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading && !data) return <SafeAreaView style={styles.center}><ActivityIndicator size="large" /></SafeAreaView>;

  const enc = data?.enc || {};
  const aiml = data?.aiml || {};
  const latestAlert = aiml?.anomalies && aiml.anomalies.length ? aiml.anomalies[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {latestAlert && (
          <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate('Alerts')}>
            <Text style={styles.alertText}>⚠️ Latest Alert: {latestAlert}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.title}>EV Battery Monitor</Text>
        <Text style={styles.subtitle}>Last update: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : '—'}</Text>

        <View style={styles.row}>
          <StatCard label="Temperature (°C)" value={enc.temp ?? '--'} />
          <StatCard label="Voltage (V)" value={enc.voltage ?? '--'} />
        </View>

        <View style={styles.row}>
          <StatCard label="Current (A)" value={enc.current ?? '--'} />
          <StatCard label="SoC (%)" value={enc.soc ?? '--'} />
        </View>

        <View style={styles.row}>
          <StatCard label="SoH (%)" value={enc.soh ?? '--'} />
          <StatCard label="Risk" value={aiml.risk ?? '--'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AIML Summary</Text>
          <Text style={styles.cardText}>{aiml.summary ?? 'No summary'}</Text>
          {aiml.anomalies && aiml.anomalies.length > 0 && (
            <>
              <Text style={[styles.cardTitle, { marginTop: 8 }]}>Anomalies</Text>
              {aiml.anomalies.map((a, i) => <Text key={i} style={styles.cardText}>• {a}</Text>)}
            </>
          )}
        </View>

        <View style={{ height: 12 }} />

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Graphs', { history })}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Open Graphs</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  cardTitle: { fontWeight: '800' },
  cardText: { color: '#333', marginTop: 4 },
  btn: { backgroundColor: '#0a84ff', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  alertBanner: { backgroundColor: '#fff3cd', padding: 10, borderRadius: 8, marginBottom: 12 },
  alertText: { color: '#7a4a00', fontWeight: '700' }
});
