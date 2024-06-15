import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { useSendFeedback } from '../api/comments';
import { useSettings } from '../providers/SettingsProvider';

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const { theme } = useSettings();
    const styles = useMemo(() => createStyles(theme), [theme])

    const { mutateAsync } = useSendFeedback();

    const onSend = async () => {
        if (!feedback) return;

        setLoading(true);

        await mutateAsync(feedback);

        setFeedback('');

        setLoading(false);
    }

    return (
        <>
            <View style={styles.feedbackInput}>
                <TextInput
                    placeholder="Feedback"
                    placeholderTextColor='grey'
                    value={feedback}
                    onChangeText={setFeedback}
                    style={{ fontFamily: 'mon', width: '80%' }}
                />
                {loading ? 
                    <ActivityIndicator style={styles.sendBtn} />
                    :
                    <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
                        <Feather
                            name='send'
                            size={24}
                            color={theme.secondary}
                        />
                    </TouchableOpacity>}
            </View>
            <Text style={styles.text} >Anyone can provide feedback for the app. Please recommend features that you might like to see in the future!</Text>
        </>
    )
}

export default FeedbackForm

const createStyles = (theme: any) => StyleSheet.create({
    feedbackInput: {
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingLeft: 20,
        borderRadius: 8,
        marginTop: 30, 
        height: 50,
        flex: 1,

        elevation: 2,
        shadowColor: theme.secondary,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
    },
    sendBtn: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,

        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        maxWidth: 40,
    },
    text: {
        color: theme.secondary,
        marginTop: 20,
        fontFamily: 'mon',
        fontSize: 18
    }
})