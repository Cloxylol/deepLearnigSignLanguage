import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { colors } from '../theme/colors';
import { useModel } from '../lib/useModel';

export default function LiveScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [speak, setSpeak] = useState(true);
    const camRef = useRef(null);
    const { ready, predict } = useModel();

    if (!permission) return <View style={{ flex: 1 }} />;
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <Text style={{ textAlign: 'center', marginBottom: 12 }}>Permission caméra requise.</Text>
                <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Autoriser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const snapAndAnalyze = async () => {
        if (!camRef.current) return;
        if (!ready) return Alert.alert('Modèle en chargement...');
        const photo = await camRef.current.takePictureAsync({ quality: 0.6 });
        const out = await predict(photo?.uri);
        if (speak && out?.top1) Speech.speak(out.top1);
        navigation.navigate('Result', { imageUri: photo?.uri, ...out });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Switch value={speak} onValueChange={setSpeak} />
                <Text>Lecture vocale</Text>
            </View>

            <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}>
                <CameraView ref={camRef} style={{ flex: 1 }} facing="back" />
            </View>

            <TouchableOpacity onPress={snapAndAnalyze} style={{ backgroundColor: colors.accent, padding: 16, borderRadius: 12 }}>
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Capturer & Analyser</Text>
            </TouchableOpacity>
        </View>
    );
}
