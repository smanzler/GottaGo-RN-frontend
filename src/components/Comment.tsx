import { Keyboard, StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import RemoteImage from './RemoteImage'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { defaultStyles } from '../constants/Styles'

interface Props {
    comment: any;
    setReply: React.Dispatch<React.SetStateAction<number | null>>;
    commentRef: React.RefObject<TextInput>;
}

const Comment = ( {comment, setReply, commentRef}: Props ) => {



    const onReplyPress = () => {
        setReply(comment.id);

        commentRef.current?.focus()
    }

    return (
        <View style={{marginBottom: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', gap: 5}}>
                    <View style={styles.profilePic}>
                        <RemoteImage style={{ width: '100%', aspectRatio: 1 }} path={`${comment.created_by}.png`} profile />
                    </View>
                    <Text style={styles.user}>{comment.username}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                    {Array.from({length: 5}, (_, index) => (
                        <Ionicons
                            key={index}
                            name='star'
                            size={20}
                            color={index < comment.rating ? 'gold' : 'grey'}
                        />
                    ))}
                </View>
            </View>

            <View style={{marginTop: 7}}>
                <Text style={styles.comment}>{comment.message}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{marginTop: 7, backgroundColor: 'pink', alignSelf: 'flex-start'}} onPress={onReplyPress}>
                    <Text onPress={onReplyPress}style={defaultStyles.p}>Reply</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    profilePic: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden'
    },
    user: {
        fontFamily: 'mon-sb',
        paddingTop: 3,
    },
    comment: {
        fontFamily: 'mon',
    }
})

export default Comment