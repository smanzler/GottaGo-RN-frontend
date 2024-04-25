import { View, Text } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Camera, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location'

interface Props {
    rooms: any,
};

const RoomsMap = (rooms: Props) => {

    const mapViewRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
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
            zoom: 14,
          } as Camera;

          mapViewRef.current?.setCamera(camera)
        })();
      }, []);

    return (
        <View style={styles.container}>
            <MapView 
                ref={mapViewRef}
                style={styles.map} 
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default RoomsMap;