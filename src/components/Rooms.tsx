import { View, Text, ListRenderItem, StyleSheet, Image, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDefaultStyles } from "@/src/constants/Styles";
import { Link } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import RemoteImage from "./RemoteImage";
import { useSettings } from "../providers/SettingsProvider";

interface Props {
    category: string;
    rooms: any[];
    refetch: any;
}

const Rooms = ({ category, rooms, refetch }: Props) => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme);
    const styles = useMemo(() => createStyles(theme), [theme])

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

    const renderRow: ListRenderItem<any> = ({ item }) => {
        const roundedRating = Math.round(item.rating * 2) / 2;

        return (
            <Link href={{ pathname: 'room/', params: item }} asChild>
                <TouchableOpacity>
                    <Animated.View style={styles.rooms} entering={FadeInRight} exiting={FadeOutLeft}>
                        <View style={styles.image}>
                            <RemoteImage path={item.image} style={{ width: '100%', height: '100%' }} />
                            {/* <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Ionicons name="heart-outline" size={24} color={'#000'} />
                            </TouchableOpacity> */}
                        </View>

                        <View style={styles.text}>
                            <View style={styles.header}>
                                <Text style={styles.name}>{item.name}</Text>
                                {item.dist_meters && <Text style={styles.distance}>{new Intl.NumberFormat('en-US', {
                                    style: 'unit',
                                    unit: 'meter',
                                    unitDisplay: 'narrow',
                                    maximumFractionDigits: 1,
                                }).format(item.dist_meters)}</Text>}
                            </View>
                            <View style={styles.bottomContainer}>
                                <Text style={styles.description}>{item.description}</Text>
                                <View style={{flexDirection: 'row', gap: 2}}>
                                    <Text style={styles.rating}> { typeof item.rating === 'number' ? item.rating.toFixed(1) : 0}</Text>
                                    <View style={styles.stars}>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <View key={`${item.id}-${index}`} style={{ position: 'relative', width: 15, height: 15 }}>
                                                <FontAwesome
                                                    name={index + 1 <= roundedRating ? 'star' : index + 0.5 === roundedRating ? 'star-half' : 'star'}
                                                    size={15}
                                                    color={index + 1 <= roundedRating || index + 0.5 === roundedRating ? 'gold' : 'grey'}
                                                />
                                                {index + 0.5 === roundedRating &&
                                                    <FontAwesome 
                                                        name='star'
                                                        size={15}
                                                        color='grey'
                                                        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
                                                    />
                                                }
                                            </View>
                                        ))}
                                    </View>
                                    <Text style={styles.rating}>{`(${item.rating_count})`}</Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Link>
        )
    };

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

const createStyles = (theme: any) => StyleSheet.create({
    rooms: {
        padding: 10,
        flexDirection: 'row'
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
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
        color: theme.secondary,
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
    description: {
        color: theme.secondary,
        fontFamily: 'mon',
        maxHeight: 40,
        overflow: 'hidden',
    },
    distance: {
        color: theme.secondary,
        fontFamily: 'mon',
    },
    rating: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        textAlignVertical: 'bottom',
    },
    stars: {
        flexDirection: 'row',
        paddingTop: 1,
    }
})

export default Rooms;