import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import { Link } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import { userSignOut } from '../api/userApi';
import Loading from '@/components/Loading';

const Page = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(false);

    const handleLogOut = async () => {
        if (loading) return;

        setLoading(true);

        logout(); 
        await userSignOut();

        setLoading(false);
    }

    return (
        <View style={styles.container}>
            
                {!isLoggedIn ?  
                    <Link href={'/(auth)/login'}>
                        <Text>Login</Text>
                    </Link>
                    :
                    <TouchableOpacity onPress={handleLogOut}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                }
            {loading && <Loading />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default Page;