import { View, Text, ListRenderItem, StyleSheet, Image, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/src/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Colors from "@/src/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import RemoteImage from "./RemoteImage";

interface Props {
    category: string;
    rooms: any[];
    refetch: any;
}

const Rooms = ({ category, rooms, refetch }: Props) => {
    const [ loading, setLoading ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 200)
    }, [category])

    const onRefresh = async () => {
        setRefreshing(true);

        await refetch();

        setRefreshing(false);
    }

    const renderRow: ListRenderItem<any> = ({ item }) => (
        <Link href={{pathname: 'room/', params: item}} asChild>
            <TouchableOpacity>
                <Animated.View style={styles.rooms} entering={FadeInRight} exiting={FadeOutLeft}>
                    <View style={styles.image}>
                        <RemoteImage path={item.image} style={{width: '100%', height: '100%'}} />
                        <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }}>
                            <Ionicons name="heart-outline" size={24} color={'#000'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.text}>
                        <View style={styles.header}>
                            <Text style={{ fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'mon-sb' }}>★ {item.rating || 0}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
    
    return (
        <View style={defaultStyles.container}>
            <FlatList 
                renderItem={renderRow}
                data={rooms}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rooms: {
        padding: 10,
        flexDirection: 'row'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: 'grey',
        overflow: 'hidden'
    },
    text: {
        flex: 1,
        padding: 10
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    },
    name: {
        fontSize: 16, 
        fontFamily: 'mon-sb',
    },
    description: {
        overflow: 'hidden'
    },
    rating: {
        fontFamily: 'mon-sb'
    },
})

export default Rooms;