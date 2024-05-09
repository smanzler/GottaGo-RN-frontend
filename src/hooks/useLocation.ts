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

    let location = await Location.getLastKnownPositionAsync({});

    const camera = {
        center: {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
        },
        zoom: 18
    } as Camera;

    mapViewRef.current?.setCamera(camera)
}