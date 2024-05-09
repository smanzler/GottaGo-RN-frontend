import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Camera, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location'
import { useLocation } from '../hooks/useLocation';
import { TouchableOpacity } from 'react-native';
import { getRoomsInView } from '../api/rooms';

interface Props {
    rooms: any[];
}

const RoomsMap = ({rooms}: Props) => {
    const [loading, setLoading] = useState(false);

    const mapViewRef = useRef<MapView>(null);

    useEffect(() => {
        useLocation(mapViewRef)
    }, []);

    const onMarkerPress = (longitude: any, latitude: any) => {
        const camera = {
            center: {
                latitude,
                longitude,
            },
            zoom: 18,
        } as Camera;

        mapViewRef.current?.animateCamera(camera);
    }

    // const [timer, setTimer] = useState<NodeJS.Timeout>();

    // const handleRegionChangeComplete = () => {
    //     setLoading(true);
        
    //     if (timer) {
    //         clearTimeout(timer);
    //     }

    //     const newTimer = setTimeout(async () => {

    //         const bounds = await mapViewRef.current?.getMapBoundaries();

    //         if (bounds) {
    //             console.log("getting rooms from view")
    //             const newRooms = await getRoomsInView(
    //                 bounds.southWest.latitude,
    //                 bounds.southWest.longitude,
    //                 bounds.northEast.latitude,
    //                 bounds.northEast.longitude,
    //             )
    //             console.log(newRooms)

    //             setRooms(newRooms)
    //         }
    //         setLoading(false)

    //     }, 2000);

    //     setTimer(newTimer);
    // };

    // const handleRegionChange = () => {
    //     if (timer) {
    //         clearTimeout(timer);
    //     }
    // }


    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator style={styles.loading} size={'large'} />}
            <MapView
                ref={mapViewRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >
                {rooms.map((room) => (
                    <Marker
                        key={room.id}
                        onPress={() => onMarkerPress(room.long, room.lat)}
                        coordinate={{
                            latitude: room.lat,
                            longitude: room.long
                        }}
                    >
                        <TouchableOpacity
                            style={styles.marker}
                        >
                            <Text>{room.rating ? `★${room.rating}` : "0 ★"}</Text>
                        </TouchableOpacity>
                    </Marker>
                ))}

            </MapView>
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
    marker: {
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 20,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 10,
        zIndex: 1,
    }
});

export default RoomsMap;