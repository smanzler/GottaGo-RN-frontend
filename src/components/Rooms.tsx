import { View, Text, ListRenderItem, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/src/constants/Styles";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Colors from "@/src/constants/Colors";
import { Room } from "../interfaces/Room";
import { FlatList } from "react-native-gesture-handler";

interface Props {
    category: string;
    rooms: any[];
    listRef: any;
}

const Rooms = ({ category, rooms, listRef }: Props) => {
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 200)
    }, [category])

    const renderRow: ListRenderItem<Room> = ({ item }) => (
        <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity>
                <Animated.View style={styles.rooms} entering={FadeInRight} exiting={FadeOutLeft}>
                    <Image style={styles.image}/>
                    <TouchableOpacity style={{ position: 'absolute', top: 30, right: 30 }}>
                        <Ionicons name="heart-outline" size={24} color={'#000'} />
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ maxWidth: '80%', fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons name="star" size={16} />
                            <Text style={{ fontFamily: 'mon-sb' }}>{item.rating}</Text>
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
                data={rooms}
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
        backgroundColor: 'grey',
    },
})

export default Rooms;