import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSettings } from '../providers/SettingsProvider';

interface Props {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onReport: () => void;
    reportLoading: boolean;
}

const ReportModal = ({ modalVisible, setModalVisible, onReport, reportLoading }: Props) => {
    const { theme } = useSettings();
    const styles = useMemo(() => createStyles(theme), [theme])

    return (
        <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer} >
                    <TouchableOpacity style={styles.exitBtn} onPress={() => setModalVisible(false)}>
                        <Ionicons name="close-outline" size={28} color={theme.secondary} />
                    </TouchableOpacity>

                    <Text style={styles.header}>Are you sure you want to report this room?</Text>

                    <TouchableOpacity 
                        style={{flexDirection: 'row', gap: 7, alignItems: 'center'}} 
                        onPress={onReport}
                    >
                        <Text style={styles.modalText}>{reportLoading ? 'Reporting...' : 'Report'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: theme.tint,
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        color: theme.secondary,
        fontFamily: 'mon',
        fontSize: 18,
        marginBottom: 60,
        width: 180,
        textAlign: 'center',
    },
    modalText: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        fontSize: 18,
        marginBottom: 20,
    },
    exitBtn: { 
        position: 'absolute',
        top: 10, 
        left: 10,

        width: 35, 
        aspectRatio: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    }
})

export default ReportModal