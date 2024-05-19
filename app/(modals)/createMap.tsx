import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { LatLng, LongPressEvent, Marker } from 'react-native-maps'
import { useLocation } from '@/src/hooks/useLocation'
import { Stack } from 'expo-router'

const createMap = () => {

    const mapViewRef = useRef<MapView>(null);

    const [marker, setMarker] = useState<LatLng>()

    useEffect(() => {
        useLocation(mapViewRef)
    }, [])

    const onLongMapPress = (event: LongPressEvent) => {
        setMarker(event.nativeEvent.coordinate)
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen

            />

            <MapView
                ref={mapViewRef}
                style={styles.mapView}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onLongPress={onLongMapPress}
            >
                {marker && <Marker coordinate={marker} />}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    mapView: {
        width: '100%',
        height: '100%'
    }
})

export default createMap