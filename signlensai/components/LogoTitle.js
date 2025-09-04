import React from 'react';
import { View, Text, Image } from 'react-native';

export const LogoTitle = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('../assets/logo.png')} style={{ width: 28, height: 28, marginRight: 6 }} />
        <Text style={{ fontFamily: 'LibreCaslonText_700Bold', fontSize: 22, color: '#FF5E73'}}>SignLensAI</Text>
    </View>
);
