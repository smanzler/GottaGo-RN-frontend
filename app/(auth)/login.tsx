import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import { useContext, useState } from 'react';
import { userLogin } from '../api/userApi';
import { useRouter } from 'expo-router';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '@/components/Loading';

const Page = () => {
  useWarmUpBrowser();
  const { login } = useContext(AuthContext);

  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onSignInPress = async () => {
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

      const result = await userLogin({
        email: emailAddress,
        password: password,
        twoFactorCode: "string",
        twoFactorRecoveryCode: "string",
      }, login);
      console.log(result.status)
      if (result.status === 200) {
        await SecureStore.setItemAsync('AccessToken', result.data.accessToken);
        await SecureStore.setItemAsync('RefreshToken', result.data.refreshToken);
        console.log("logged in");
        router.back();
        return;
      }

    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={defaultStyles.btn} onPress={onSignInPress}>
        <Text style={defaultStyles.btnText}>Continue</Text>
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

      <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.btnOutlineText}>Sign Up</Text>
      </TouchableOpacity>

      {/* <View style={{ gap: 20 }}>
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
      </View> */}
      {loading && <Loading />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
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