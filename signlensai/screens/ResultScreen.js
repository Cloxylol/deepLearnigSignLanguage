import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import PredictionBars from '../components/PredicitionBars.js';
import { colors } from '../theme/colors';

export default function ResultScreen({ route, navigation }) {
    const { imageUri, top1, top3 } = route.params ?? {};

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, gap: 16 }}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: '100%', height: 240, borderRadius: 16, backgroundColor: '#eee' }} />
            ) : null}

            <View style={{ backgroundColor: '#FDECEE', padding: 12, borderRadius: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Lettre reconnue : {top1}</Text>
            </View>

            <PredictionBars items={top3} />

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 'auto', backgroundColor: colors.primary, padding: 16, borderRadius: 12 }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
}
