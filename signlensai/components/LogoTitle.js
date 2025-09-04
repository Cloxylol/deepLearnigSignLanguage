import React from 'react';
import { View, Text, Image } from 'react-native';

export const LogoTitle = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Image source={require('../assets/logo.png')} style={{ width: 24, height: 24 }} />
        <Text style={{ fontSize: 18, fontWeight: '700' }}>SignLensAI</Text>
    </View>
);
