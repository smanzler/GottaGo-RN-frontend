import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { userSignOut } from '../api/userApi';
import Loading from '@/components/Loading';
import { defaultStyles } from '@/constants/Styles';
import { supabase } from '@/utils/supabase';

const Page = () => {
    const { session } = useAuth();

    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true);

        await supabase.auth.signOut();

        setLoading(false);
    }

    return (
        <View style={styles.container}>
            
                {!session ? 
                    <>
                        <Text style={defaultStyles.h2}>In Order to see your profile, you need to Log in</Text>
                        <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                                <Text style={defaultStyles.btnText}>Log in</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <TouchableOpacity style={defaultStyles.btn} onPress={handleLogout} disabled={loading} >
                        <Text style={defaultStyles.btnText}>{loading ? "Loggin you out..." : "Logout"}</Text>
                    </TouchableOpacity>
                }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 26,
    }
})

export default Page;