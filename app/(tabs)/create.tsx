import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';
import MapView from 'react-native-maps';
import { useInsertRoom } from '@/src/api/rooms';

const Page = () => {
    const { session } = useAuth();

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false);

    // const { mutation } = useInsertRoom();

    const onCreatePress = () => {

    }

    return (
        <ScrollView 
            style={styles.container}
            automaticallyAdjustKeyboardInsets={true}
        >
            
                {/* {!session ? 
                    <>
                        <Text style={defaultStyles.h2}>In Order to create, you need to Log in</Text>
                        <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                                <Text style={defaultStyles.btnText}>Log in</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                      
                    </>
                } */}

                <>
                    <View style={styles.mapContainer}>

                        <MapView
                            style={styles.mapView}

                        />
                    </View>

                    <Text style={[defaultStyles.h2, {marginBottom: 0}]}>Title</Text>

                    <TextInput
                        placeholder=""
                        value={title}
                        onChangeText={setTitle}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <Text style={[defaultStyles.h2, {marginBottom: 0}]}>Description</Text>

                    <TextInput
                        placeholder=""
                        value={description}
                        onChangeText={setDescription}
                        style={[defaultStyles.inputField, { marginBottom: 30 }]}
                    />

                    <TouchableOpacity
                        style={[defaultStyles.btn, { marginTop: 10 }]}
                        onPress={onCreatePress}
                        disabled={createLoading || loading}
                    >
                        <Text style={defaultStyles.btnText}>{createLoading ? "Creating..." : "Create"}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 300 }} />
                </>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
    },
    mapView: {
        width: '100%',
        height: '100%',
    },
    mapContainer: {
        width: '100%',
        height: 400,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 50,
    }
})

export default Page;