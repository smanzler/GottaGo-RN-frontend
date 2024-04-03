import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const categories = [
    {
        name: 'Restaurant',
        icon: 'restaurant'
    },
    {
        name: 'Park',
        icon: 'park'
    },
    {
        name: 'Library',
        icon: 'menu-book'
    },
    {
        name: 'Shopping Mall',
        icon: 'shopping-cart'
    },
    {
        name: 'Movie Theater',
        icon: 'theaters'
    },
    {
        name: 'Gym',
        icon: 'fitness-center'
    },
    {
        name: 'Coffee Shop',
        icon: 'local-cafe'
    },
    {
        name: 'Hospital',
        icon: 'local-hospital'
    },
    {
        name: 'Beach',
        icon: 'beach-access'
    },
    {
        name: 'All',
        icon: 'view-module'
    }
];


const ExploreHeader = () => {
    const itemsRef = useRef<Array<TouchableOpacity>>([]);
    const [ activeIndex, setActiveIndex ] = useState(0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.container}>
                    <View style={styles.actionRow}>
                        <Link href={'/(modals)/booking'} asChild>
                            <TouchableOpacity style={styles.searchBtn}>
                                <Ionicons name={"search"} size={24} />
                                <View>
                                    <Text style={{ fontFamily: 'mon-sb'}}>Where to?</Text>
                                    <Text style={{ fontFamily: 'mon', color: Colors.grey }}>Anywhere</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>

                        <TouchableOpacity style={styles.filterBtn}>
                            <Ionicons name="options-outline" size={24}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            alignItems: 'center',
                            gap: 20,
                            paddingHorizontal: 16,
                        }}
                    >
                        {categories.map((item, index) => (
                            <TouchableOpacity 
                                key={index}
                            >
                                <MaterialIcons name={item.icon as any} size={24}/>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 130,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 10,
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24,
    },
    searchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderColor: '#c2c2c2',
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        padding: 14,
        borderRadius: 30,
        backgroundColor: '#fff',

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: Colors.grey,
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: 'mon-sb',
        color: '#000',
    },
    categoriesBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#000',
        paddingBottom: 8,
        borderBottomWidth: 2,
    },
})

export default ExploreHeader;