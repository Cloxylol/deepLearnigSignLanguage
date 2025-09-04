import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const Btn = ({ title, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 12, width: '80%', alignSelf: 'center', marginVertical: 8 }}
  >
    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 24 }}>
      <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: 24 }}>Bienvenue</Text>
      <Btn title="Reconnaissance Live" onPress={() => navigation.navigate('Live')} />
      <Btn title="Reconnaissance de photo" onPress={() => navigation.navigate('Photo')} />
    </View>
  );
}
