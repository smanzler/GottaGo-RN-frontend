import MapView from 'react-native-maps';
import { Camera, Region } from 'react-native-maps';
import * as Location from 'expo-location'
import React from 'react';

export const useLocation = async (mapViewRef: React.RefObject<MapView>) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const region = {
        longitude: location?.coords.longitude,
        latitude: location?.coords.latitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    } as Region;

    mapViewRef.current?.animateToRegion(region, 500)
}