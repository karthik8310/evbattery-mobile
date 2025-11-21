import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import StatCard from '../components/StatCard';
import { API_BASE } from '../config';

export default function ENC() {
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

  const enc = data?.enc || {};
  if (loading && !data) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>ENC Values</Text>
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
        </View>

        <View style={styles.infoBox}>
          <Text style={{ fontWeight: '700' }}>Notes</Text>
          <Text style={{ marginTop: 6 }}>Temperature safe threshold: ≤45°C. Voltage expected range: 300–420V. Positive current → charging.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoBox: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6 }
});
