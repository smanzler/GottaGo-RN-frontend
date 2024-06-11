import { View, StyleSheet, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import { useWarmUpBrowser } from '@/src/hooks/useWarmUpBrowser';
import { useDefaultStyles } from '@/src/constants/Styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { } from '../../src/providers/AuthProvider';
import { supabase } from '@/src/utils/supabase';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/src/providers/SettingsProvider';

const Page = () => {
    useWarmUpBrowser();

    const router = useRouter();
    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme)

    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

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
        <KeyboardAvoidingView style={styles(theme).container} behavior='padding'>
            <View style={{ flex: 1 }}>

                <Text style={defaultStyles.header}>Log in</Text>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Email"
                    placeholderTextColor='grey'
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor='grey'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[defaultStyles.inputField, { marginBottom: 30 }]}
                />

                <TouchableOpacity
                    style={[defaultStyles.btn, { marginBottom: 10 }]}
                    onPress={onSignInPress}
                    disabled={loginLoading}
                >
                    <Text style={defaultStyles.btnText}>{loginLoading ? "Logging you in..." : "Log in"}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={defaultStyles.btnOutline}
                    onPress={() => router.replace('/signup')}
                    disabled={loginLoading}
                >
                    <Text style={defaultStyles.btnOutlineText}>Sign Up</Text>
                </TouchableOpacity>

                {/* <View style={styles.seperatorView}>
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
                    <TouchableOpacity style={styles.btnOutline} onPress={() => alert("clown")}>
                        <Ionicons name="mail-outline" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Phone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline} onPress={() => alert("clown")}>
                        <Ionicons name="logo-apple" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline} onPress={() => alert("clown")}>
                        <Ionicons name="logo-google" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnOutline} onPress={() => alert("clown")}>
                        <Ionicons name="logo-facebook" size={24} style={defaultStyles.btnIcon} />
                        <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = (theme: any) => StyleSheet.create({
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
        color: theme.grey,
        fontSize: 16,
    },
});

export default Page;