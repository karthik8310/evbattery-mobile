import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ label, value, small }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, small && {fontSize:14}]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 8,
    padding: 14,
    borderRadius: 12,
    minHeight: 90,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6
  },
  value: { fontSize: 18, fontWeight: '800', color: '#111' },
  label: { color: '#666', marginTop: 6, fontSize: 12 }
});
