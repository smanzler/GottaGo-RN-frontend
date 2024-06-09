import Colors from '@/src/constants/Colors';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import { useWarmUpBrowser } from '@/src/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/src/constants/Styles';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { } from '../../src/providers/AuthProvider';
import { supabase } from '@/src/utils/supabase';
import { Alert } from 'react-native';
import CustomAlert from '@/src/components/Alert';

const Page = () => {
    useWarmUpBrowser();

    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('')

    const [inputError, setInputError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const onSignUpPress = async () => {
        if (!emailAddress || !password || !username) {
            setInputError("Can't have empty data");
            return;
        }

        if(await checkUsername()) return;

        setLoading(true);

        const { error, data } = await supabase.auth.signUp({
            email: emailAddress,
            password,
            options: {
                data: {
                    username
                }
            }
        })

        if (error) Alert.alert(error.name, error.message);

        if (data.user) router.replace('(tabs)/');

        setLoading(false);
    }

    const checkUsername = async () => {
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
            setInputError('Username must begin with a letter and can only contain letters and numbers')
            return true;
        }

        if (username.length < 5) {
            setInputError('Username must be longer than 5 characters')
            return true;
        }

        const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username);

        if (data && data[0]) {
            setInputError('This username is already being used')
            return true;
        }

        return false;
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={{ flex: 1 }}>
                {inputError && <CustomAlert text={inputError} />}

                <Text style={defaultStyles.header}>Sign Up</Text>
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
                <TextInput
                    autoCapitalize="none"
                    placeholder="Username"
                    placeholderTextColor='grey' 
                    value={username}
                    onChangeText={setUsername}
                    style={[defaultStyles.inputField, { marginBottom: 10 }]}
                />
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={onSignUpPress}
                    disabled={loading}
                >
                    <Text style={styles.btnOutlineText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
                </TouchableOpacity>
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