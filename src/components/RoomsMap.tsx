import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Camera, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location'
import { useLocation } from '../hooks/useLocation';
import { TouchableOpacity } from 'react-native';
import { getRoomsInView } from '../api/rooms';
import { FontAwesome6 } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface Props {
    rooms: any[];
}

const RoomsMap = ({rooms}: Props) => {
    const mapViewRef = useRef<MapView>(null);

    useEffect(() => {
        useLocation(mapViewRef)
    }, []);

    const onMarkerPress = (longitude: any, latitude: any) => {
        const region = {
            longitude,
            latitude,
            longitudeDelta: 0.003,
            latitudeDelta: 0.003,
        } as Region;

        mapViewRef.current?.animateToRegion(region, 300);
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
            <TouchableOpacity style={styles.locationBtn} onPress={() => useLocation(mapViewRef)}>
                <FontAwesome6 name='location-arrow' size={24}></FontAwesome6>
            </TouchableOpacity>

            <MapView
                ref={mapViewRef}
                style={styles.map}
                showsUserLocation={true}
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
                            <Text>{room.rating ? `★${room.rating}` : "★0"}</Text>
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
    },
    locationBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#fff',
        width: 50,
        aspectRatio: 1,
        zIndex: 1,
        padding: 13,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24,
    }
});

export default RoomsMap;