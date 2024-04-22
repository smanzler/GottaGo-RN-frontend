import Colors from '@/constants/Colors';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { } from '../contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
    useWarmUpBrowser();

    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const onSignUpPress = async () => {
        setLoading(true);

        const { error, data } = await supabase.auth.signUp({
            email: emailAddress,
            password,
        })

        if (error) Alert.alert(error.message);

        if (data.user) router.back();

        setLoading(false);
    }

    const onSignInPress = async () => {
        setLoginLoading(true);

        const { error, data } = await supabase.auth.signInWithPassword({
            email: emailAddress,
            password,
        })

        if (error) Alert.alert(error.message);

        if (data.user) router.back();

        setLoginLoading(false);
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={{ flex: 1 }}>

                <Text style={defaultStyles.header}>Log in</Text>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Email"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[defaultStyles.inputField, { marginBottom: 30 }]}
                />

                <TouchableOpacity
                    style={[defaultStyles.btn, { marginBottom: 10 }]}
                    onPress={onSignInPress}
                    disabled={loginLoading || loading}
                >
                    <Text style={defaultStyles.btnText}>{loginLoading ? "Logging you in..." : "Log in"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={onSignUpPress}
                    disabled={loginLoading || loading}
                >
                    <Text style={styles.btnOutlineText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
                </TouchableOpacity>

                <View style={styles.seperatorView}>
                    <View
                        style={{
                            flex: 1,
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                    <Text style={styles.seperator}>or</Text>
                    <View
                        style={{
                            flex: 1,
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                    />
                </View>

                <View style={{ gap: 20 }}>
                    <TouchableOpacity style={styles.btnOutline}>
                        <Ionicons name="mail-outline" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Phone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline}>
                        <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline}>
                        <Ionicons name="logo-google" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline}>
                        <Ionicons name="logo-facebook" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#fff',
        padding: 26,
    },

    seperatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30,
    },
    seperator: {
        fontFamily: 'mon-sb',
        color: Colors.grey,
        fontSize: 16,
    },
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'mon-sb',
    },
});

export default Page;