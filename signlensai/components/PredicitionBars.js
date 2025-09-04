import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../theme/colors';

export default function PredictionBars({ items = [] }) {
    return (
        <View style={{ gap: 10 }}>
            {items.map(({ label, prob }) => (
                <View key={label} style={{ gap: 6 }}>
                    <Text style={{ fontWeight: '700' }}>{label} — {(prob * 100).toFixed(1)}%</Text>
                    <View style={{ height: 10, backgroundColor: '#E9EDF5', borderRadius: 999 }}>
                        <View style={{
                            height: 10,
                            width: `${Math.max(8, prob * 100)}%`,
                            backgroundColor: colors.primary,
                            borderRadius: 999
                        }} />
                    </View>
                </View>
            ))}
        </View>
    );
}
