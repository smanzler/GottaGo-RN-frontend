import { ScrollView, Settings, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import CheckBox from 'expo-checkbox';
import { router } from 'expo-router';
import { useSettings } from '@/src/providers/SettingsProvider';

const eulaCheck = () => {
    const [agree, setAgree] = useState(false)
    const { theme } = useSettings();

    const styles: any = useMemo(() => createStyles(theme), [theme]);

    const onContinue = () => {
        Settings.set({ eulaCheck: true });
        router.back();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.eula}>
                <Text style={styles.h1}>End User License Agreement (EULA)</Text>

                <Text style={styles.h2}>1. Introduction</Text>
                <Text style={styles.body}>
                    This End User License Agreement ("EULA") is a legal agreement between you and GottaGo App. This EULA agreement governs your acquisition and use of our GottaGo application ("App") directly from GottaGo or indirectly through a GottaGo authorized reseller or distributor (a "Reseller").
                </Text>

                <Text style={styles.h2}>2. Acceptance</Text>
                <Text style={styles.body}>
                    By clicking "accept" or installing and/or using the App, you are confirming your acceptance of the App and agreeing to become bound by the terms of this EULA agreement.
                </Text>

                <Text style={styles.h2}>3. License Grant</Text>
                <Text style={styles.body}>
                    GottaGo hereby grants you a personal, non-transferable, non-exclusive licence to use the App on your devices in accordance with the terms of this EULA agreement.
                </Text>

                <Text style={styles.h2}>4. Restrictions</Text>
                <Text style={styles.body}>
                    You agree not to, and you will not permit others to:
                    {'\n'}a. License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the App.
                    {'\n'}b. Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the App.
                    {'\n'}c. Post objectionable or abusive content. 
                </Text>

                <Text style={styles.h2}>5. Termination</Text>
                <Text style={styles.body}>
                    This EULA agreement is effective from the date you first use the App and shall continue until terminated. You may terminate it at any time upon written notice to GottaGo.
                </Text>

                <Text style={styles.h2}>6. Governing Law</Text>
                <Text style={styles.body}>
                    This EULA agreement, and any dispute arising out of or in connection with this EULA agreement, shall be governed by and construed in accordance with the laws of the country in which you reside.
                </Text>

                <Text style={styles.h2}>7. Contact Information</Text>
                <Text style={styles.body}>
                    If you have any questions about this EULA, please contact us at support@gottago.com.
                </Text>
            </ScrollView>
            <View style={styles.footer}>
                <View style={{flexDirection: 'row', flex: 1, gap: 10}}>
                    <CheckBox value={agree} onValueChange={setAgree} />
                    <Text style={{flex: 1, color: theme.secondary}}>By checking this box you agree to the End User License Agreement (EULA). </Text>

                </View>
                <TouchableOpacity style={[styles.btn, {backgroundColor: agree ? 'blue' : 'lightgrey'}]} disabled={!agree} onPress={onContinue}>
                    <Text style={{ fontFamily: 'mon-sb', color: '#fff',}}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default eulaCheck

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        backgroundColor: theme.primary,
        flex: 1,
        padding: 20,
    },
    h1: {
        fontFamily: 'mon-b',
        fontSize: 24,
        marginBottom: 16,
    },
    h2: {
        fontFamily: 'mon-sb',
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
    },
    body: {
        fontFamily: 'mon',
        fontSize: 16,
        marginBottom: 8,
        lineHeight: 24,
    },
    eula: {
        flex: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 80,
        backgroundColor: '#fff',

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
    },
    btn: {
        marginLeft: 10,
        padding: 5, 
        justifyContent: 'center',
        borderRadius: 5,
        height: 30
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.tint,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',

        height: 80,

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
    }
})