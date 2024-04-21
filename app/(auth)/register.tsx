import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { defaultStyles } from '@/constants/Styles';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { userRegister } from '../api/userApi';

const Register = () => {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const onRegisterPress = async () => {
        if (loading) return;

        setLoading(true);

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (emailRegex.test(emailAddress)) {
            console.log("Valid email: ", emailAddress);
        } else {
            console.log("Invalid email: ", emailAddress);
            return;
        }

        try {

            const result = await userRegister({
                email: emailAddress,
                password: password,
            });
            console.log(result.status)
            if (result.status === 200) {
                console.log("created account");
                router.back();
                return;
            } else if (result.status === 400) {
                console.log("email already in use")
            }

        } catch (err: any) {
            alert(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={defaultStyles.header}>Register</Text>
            <TextInput
                autoCapitalize="none"
                placeholder="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={[defaultStyles.inputField, { marginBottom: 10 }]}
            />
            <TextInput
                autoCapitalize="none"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={[defaultStyles.inputField, { marginBottom: 10 }]}
            />
            <TextInput
                autoCapitalize="none"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={[defaultStyles.inputField, { marginBottom: 10 }]}
            />
            <TouchableOpacity style={defaultStyles.btn} onPress={onRegisterPress}>
                <Text style={defaultStyles.btnText}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        backgroundColor: '#fff',
        padding: 26,
    },
})

export default Register