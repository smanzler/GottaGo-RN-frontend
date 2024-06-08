import MapView from 'react-native-maps';
import { Camera, Region } from 'react-native-maps';
import * as Location from 'expo-location'
import React from 'react';
import { Alert } from 'react-native';

export const useLocation = async (mapViewRef: React.RefObject<MapView>, useLastKnown?: boolean | undefined) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        useLastKnown && Alert.alert("Location", "To use the location button, you must allow location permissions in settings");
        return;
    }

    let location = useLastKnown ? await Location.getLastKnownPositionAsync({}) : await Location.getCurrentPositionAsync({});

    const region = {
        longitude: location?.coords.longitude,
        latitude: location?.coords.latitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
    } as Region;

    mapViewRef.current?.animateToRegion(region, 500)
}