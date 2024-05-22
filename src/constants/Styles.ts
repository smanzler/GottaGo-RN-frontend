import { StyleSheet } from "react-native";
import Colors from "./Colors";

export const defaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontFamily: 'mon-sb',
        fontSize: 28,
        marginBottom: 10,
    },
    h2: {
        fontFamily: 'mon',
        fontSize: 18,
        marginBottom: 50,
    },
    inputField: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ababab',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    btn: {
        backgroundColor: Colors.primary,
        height: 50, 
        borderRadius: 8, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'mon-b',
    },
    btnIcon: {
        position: 'absolute',
        left: 16,
    },
    bubbles: {
        width: 150,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleBtn: {
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#fff',
        borderColor: Colors.grey,
        borderRadius: 30,
        width: 50,
        aspectRatio: 1,
        borderWidth: 1,

        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },

        zIndex: 1,
    },
    footer: {
        position: 'absolute',
        height: 100,
        bottom: 0,
        left: 0, 
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopColor: Colors.grey,
        borderTopWidth: StyleSheet.hairlineWidth,
    }
})