import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

interface Props {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    rating: number;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    onAddRatingPress: () => void;
    ratingLoading: boolean;
}

const RatingModal = ({ modalVisible, setModalVisible, rating, setRating, onAddRatingPress, ratingLoading }: Props) => {

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
                        <Ionicons name="close-outline" size={28} />
                    </TouchableOpacity>

                    <Text style={styles.modalText}>Add your rating</Text>

                    <View style={styles.starContainer}>
                        {Array.from({length: 5}, (_, index) => (
                            <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
                                <Ionicons
                                    name='star'
                                    size={40}
                                    color={index < rating ? 'gold' : 'grey'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity 
                        style={{flexDirection: 'row', gap: 7, alignItems: 'center'}} 
                        onPress={onAddRatingPress}
                        disabled={ratingLoading}
                    >
                        <Text style={{fontFamily: 'mon', fontSize: 14}}>{ratingLoading ? 'Adding rating' : 'Add rating'}</Text>
                        <FontAwesome6 name='add' size={20}/>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontFamily: 'mon-sb',
        fontSize: 18,
        marginBottom: 20,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
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

export default RatingModal