import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const t = setTimeout(() => navigation.replace('Home'), 900);
        return () => clearTimeout(t);
    }, [navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
            <Image source={require('../assets/splash-icon.png')} style={{ width: 400, height: 120, marginBottom: 16 }} />
            <ActivityIndicator color={colors.primary} />
        </View>
    );
}