import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { API_BASE } from '../config';

export default function Graphs({ route }) {
  const [allSamples, setAllSamples] = useState([]);
  const [history, setHistory] = useState([]);
  const screenWidth = Dimensions.get('window').width - 32;

  useEffect(() => {
    axios.get(`${API_BASE}/api/all`).then(res => {
      setAllSamples(res.data || []);
      setHistory((res.data || []).map(s => ({ ts: s.timestamp || new Date().toISOString(), enc: s.enc })));
    }).catch(()=>{});
  }, []);

  const navHistory = route?.params?.history || [];
  const mergedHistory = [...(history || []), ...navHistory.slice().reverse()].slice(-200);

  const labels = mergedHistory.map(s => {
    const d = new Date(s.ts);
    return `${d.getHours()}:${('0'+d.getMinutes()).slice(-2)}:${('0'+d.getSeconds()).slice(-2)}`;
  });

  const temps = mergedHistory.map(s => s.enc?.temp ?? 0);
  const volts = mergedHistory.map(s => s.enc?.voltage ?? 0);
  const currents = mergedHistory.map(s => s.enc?.current ?? 0);
  const socs = mergedHistory.map(s => s.enc?.soc ?? 0);
  const sohs = mergedHistory.map(s => s.enc?.soh ?? 0);

  if (mergedHistory.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding:16}}>No history available yet — go to Dashboard to let it collect live samples.</Text>
      </SafeAreaView>
    );
  }

  // Trend indicators (simple)
  const tempTrend = temps.length >= 2 ? (temps[temps.length-1] > temps[0] ? 'Rising ↑' : 'Falling ↓') : 'Stable';
  const voltageTrend = volts.length >= 2 ? (volts[volts.length-1] > volts[0] ? 'Rising ↑' : 'Falling ↓') : 'Stable';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{padding:16}}>
        <View style={styles.trendRow}>
          <View style={styles.trendCard}><Text style={{fontWeight:'800'}}>Temp Trend</Text><Text>{tempTrend}</Text></View>
          <View style={styles.trendCard}><Text style={{fontWeight:'800'}}>Voltage Trend</Text><Text>{voltageTrend}</Text></View>
        </View>

        <Text style={styles.title}>Temperature (°C) — Last {mergedHistory.length} samples</Text>
        <LineChart
          data={{ labels, datasets: [{ data: temps }] }}
          width={screenWidth}
          height={220}
          yAxisSuffix="°C"
          withDots={false}
          bezier
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(10,132,255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 12 }}
        />

        <Text style={[styles.title, { marginTop: 18 }]}>Voltage vs Current</Text>
        <LineChart
          data={{
            labels,
            datasets: [
              { data: volts },
              { data: currents }
            ]
          }}
          width={screenWidth}
          height={240}
          withDots={false}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(10,132,255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 12 }}
        />

        <Text style={[styles.title, { marginTop: 18 }]}>History — All Parameters</Text>
        <Text style={{ marginTop: 8, marginBottom: 8 }}>Temp / Volt / Current / SoC / SoH</Text>

        <LineChart
          data={{
            labels,
            datasets: [
              { data: temps },
              { data: volts },
              { data: currents }
            ]
          }}
          width={screenWidth}
          height={260}
          withDots={false}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(10,132,255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          }}
          style={{ marginVertical: 8, borderRadius: 12 }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  title: { fontWeight: '800', fontSize: 16 },
  trendRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:12 },
  trendCard: { backgroundColor:'#fff', padding:10, borderRadius:10, width:'48%', shadowColor:'#000', shadowOpacity:0.04, shadowRadius:6, alignItems:'center' }
});
