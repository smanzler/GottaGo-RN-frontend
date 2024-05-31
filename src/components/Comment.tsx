import { Keyboard, StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import RemoteImage from './RemoteImage'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { defaultStyles } from '../constants/Styles'
import Curve from './Curve'

interface Props {
    comment: any;
    setReply: React.Dispatch<React.SetStateAction<number | null>>;
    commentRef: React.RefObject<TextInput>;
}

const Comment = ({ comment, setReply, commentRef }: Props) => {

    const onReplyPress = () => {
        setReply(comment.id);

        commentRef.current?.focus()
    }

    return (
        <>
            <View style={{ marginTop: 20, borderBlockColor: 'pink' }}>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <View style={styles.profilePic}>
                        <RemoteImage style={{ width: '100%', aspectRatio: 1 }} path={`${comment.created_by}.png`} profile />
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.user}>{comment.username}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                {comment.rating && Array.from({ length: 5 }, (_, index) => (
                                    <Ionicons
                                        key={index}
                                        name='star'
                                        size={20}
                                        color={index < comment.rating ? 'gold' : 'grey'}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={{ marginTop: 7 }}>
                            <Text style={styles.comment}>{comment.message}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginTop: 7, alignSelf: 'flex-start' }} onPress={onReplyPress}>
                                <Text onPress={onReplyPress} style={defaultStyles.p}>Reply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {comment.replies && comment.replies.length > 0 && <View style={styles.firstLine} />}
            </View>

                {comment.replies && comment.replies.length > 0 && comment.replies.map((reply: any, index: number) => (
                    <View key={reply.id} style={styles.line}>
                        <Comment comment={reply} setReply={setReply} commentRef={commentRef} />
                        <Curve />
                        {index !== comment.replies.length - 1 && <View style={styles.secondLine} />}
                    </View>
                ))}
        </>
    )
}

const styles = StyleSheet.create({
    profilePic: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
    },
    user: {
        fontFamily: 'mon-sb',
        paddingTop: 3,
    },
    comment: {
        fontFamily: 'mon',
    },
    firstLine: {
        position: 'absolute',
        left: 12,
        top: 28,
        bottom: 0,
        width: 2,

        backgroundColor: '#bbb'
    },
    secondLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 2,

        backgroundColor: '#bbb'
    },
    line: {
        marginLeft: 12,
        paddingLeft: 12,
    }
})

export default Comment