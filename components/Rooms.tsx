import { View, Text, FlatList, ListRenderItem, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Link } from "expo-router";
import { room } from "@/interfaces/room";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Colors from "@/constants/Colors";

interface Props {
    rooms: any[];
    category: string;
}

const Rooms = ({ rooms: items, category }: Props) => {
    const [ loading, setLoading ] = useState(false);
    const listRef = useRef<FlatList>(null);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 200)
    }, [category])

    const renderRow: ListRenderItem<room> = ({ item }) => (
        <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity>
                <Animated.View style={styles.rooms} entering={FadeInRight} exiting={FadeOutLeft}>
                    <Image source={{uri: item.medium_url}} style={styles.image}/>
                    <TouchableOpacity style={{ position: 'absolute', top: 30, right: 30 }}>
                        <Ionicons name="heart-outline" size={24} color={'#000'} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ maxWidth: '80%', fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="star" size={16} />
                            <Text style={{ fontFamily: 'mon-sb' }}>{item.review_scores_rating / 20}</Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
    
    return (
        <View style={defaultStyles.container}>
            <FlatList 
                renderItem={renderRow}
                ref={listRef}
                data={loading ? [] : items}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rooms: {
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
})

export default Rooms;