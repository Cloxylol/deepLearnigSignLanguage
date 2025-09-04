import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { useModel } from '../lib/useModel';

export default function PhotoScreen({ navigation }) {
    const [uri, setUri] = useState(null);
    const { ready, predict } = useModel();

    const pick = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],        
            quality: 0.7,
        });
        if (!res.canceled) setUri(res.assets[0].uri);
    };

    const onAnalyze = async () => {
        if (!uri) return Alert.alert('Choisis une image');
        if (!ready) return Alert.alert('Modèle en chargement...');
        const out = await predict(uri);
        navigation.navigate('Result', { imageUri: uri, ...out });
    };

    return (
        <View style={{ flex: 1, padding: 20, gap: 16 }}>
            <TouchableOpacity onPress={pick} style={{ flex: 1, backgroundColor: colors.accent, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                {uri ? <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 16 }} /> :
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Choisir une image</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={onAnalyze} style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 12 }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Analyser</Text>
            </TouchableOpacity>
        </View>
    );
}
