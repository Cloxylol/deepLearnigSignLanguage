import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import { colors } from '../theme/colors';
import { useModel } from '../lib/useModel';

const INTERVAL_MS = 1000;
const WINDOW = 3;
const MIN_REPEAT = 2;

const USE_API = true;
const API_URL = 'http://192.168.1.156:5001'; //


async function predictViaApi(base64) {
    try {
        const formData = new FormData();
        formData.append('image', {
            uri: `data:image/jpeg;base64,${base64}`,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });

        const r = await fetch(`${API_URL}/vector`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                // Ne pas mettre 'Content-Type', fetch le gère automatiquement pour FormData
            },
            body: formData,
        });
        const js = await r.json();
        if (js.error) {
            console.log('API error:', js.error);
            return { top1: null, top3: [] };
        }
        return { top1: js.label, top3: js.top3 || [] };
    } catch (e) {
        console.log('API error', e);
        return { top1: null, top3: [] };
    }
}
export default function LiveScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const camRef = useRef(null);
    const { ready, predict } = useModel(); // local 

    const [running, setRunning] = useState(true);
    const [speak, setSpeak] = useState(false);
    const [recognized, setRecognized] = useState('');
    const [lastTop1, setLastTop1] = useState(null);
    const [windowBuf, setWindowBuf] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            let timer = null;

            const loop = async () => {
                if (!running || !camRef.current || (!USE_API && !ready)) return;
                try {
                    const photo = await camRef.current.takePictureAsync({
                        quality: 0.5,
                        base64: true,
                        skipProcessing: true,
                    });

                    const out = USE_API
                        ? await predictViaApi(photo.base64)
                        : await predict(photo.base64 || photo.uri);

                    const top1 = out?.top1;
                    if (!top1) return;

                    setWindowBuf((buf) => {
                        const nb = [...buf, top1].slice(-WINDOW);
                        const counts = nb.reduce((a, k) => ((a[k] = (a[k] || 0) + 1), a), {});
                        const winner = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
                        const confident = counts[winner] >= MIN_REPEAT;

                        if (confident && winner !== lastTop1) {
                            setLastTop1(winner);
                            if (winner === 'space') setRecognized((t) => t + ' ');
                            else if (winner === 'delete') setRecognized((t) => t.slice(0, -1));
                            else if (winner !== 'nothing') {
                                setRecognized((t) => t + winner);
                                if (speak) Speech.speak(winner);
                            }
                        }
                        return nb;
                    });
                } catch (e) {
                    console.log('live loop error', e);
                }
            };

            timer = setInterval(loop, INTERVAL_MS);
            return () => timer && clearInterval(timer);
        }, [running, ready, speak, lastTop1])
    );

    if (!permission) return <View style={{ flex: 1 }} />;
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <Text style={{ textAlign: 'center', marginBottom: 12 }}>
                    Permission caméra requise pour la lecture en direct.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 10 }}
                >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Autoriser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16, gap: 12 }}>
            {/* Options */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Switch value={speak} onValueChange={setSpeak} />
                    <Text>Lecture vocale</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setRunning((v) => !v)}
                    style={{ backgroundColor: running ? '#E45858' : colors.primary, padding: 10, borderRadius: 8 }}
                >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>{running ? 'Pause' : 'Démarrer'}</Text>
                </TouchableOpacity>
            </View>

            {/* Caméra */}
            <View style={{ flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}>
                <CameraView ref={camRef} style={{ flex: 1 }} facing="back" />
            </View>

            {/* Encart texte reconnu */}
            <View style={{ minHeight: 80, backgroundColor: '#F6F8FB', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: '700', marginBottom: 6 }}>Texte reconnu :</Text>
                <ScrollView>
                    <Text style={{ fontSize: 18 }}>{recognized || '...'}</Text>
                </ScrollView>
                {/* Indicateur backend courant */}
                <Text style={{ marginTop: 6, color: '#6b7280', fontSize: 12 }}>
                    Backend : {USE_API ? 'API Flask' : 'Local (useModel)'}
                </Text>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                    onPress={() => setRecognized((t) => t.slice(0, -1))}
                    style={{ flex: 1, backgroundColor: '#E9EDF5', padding: 14, borderRadius: 10 }}
                >
                    <Text style={{ textAlign: 'center', fontWeight: '700' }}>Effacer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (recognized.trim()) Speech.speak(recognized.trim());
                        setRecognized((t) => t + ' ');
                    }}
                    style={{ width: 120, backgroundColor: colors.accent, padding: 14, borderRadius: 10 }}
                >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Espace</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}