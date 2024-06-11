import { StyleSheet } from "react-native";

export const useDefaultStyles = (theme: any) => StyleSheet.create({
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
        backgroundColor: theme.primary,
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
    btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.grey,
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
        borderColor: theme.grey,
        borderRadius: 30,
        width: 50,
        aspectRatio: 1,
        borderWidth: StyleSheet.hairlineWidth,

        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },

        zIndex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginVertical: 24,

        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        alignItems: 'center'
    },
    p: {
        fontFamily: 'mon'
    }
})