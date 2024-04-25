import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import Loading from '@/src/components/Loading';
import { defaultStyles } from '@/src/constants/Styles';
import { supabase } from '@/src/utils/supabase';

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
                        <Text style={defaultStyles.h2}>In Order to create, you need to Log in</Text>
                        <TouchableOpacity style={defaultStyles.btn} onPress={() => router.navigate('/(auth)/login')}>
                                <Text style={defaultStyles.btnText}>Log in</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                      
                    </>
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