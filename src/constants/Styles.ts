import { StyleSheet } from "react-native";

export const useDefaultStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primary,
    },
    header: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        fontSize: 28,
        marginBottom: 10,
    },
    h2: {
        color: theme.secondary,
        fontFamily: 'mon',
        fontSize: 18,
        marginBottom: 50,
    },
    inputField: {
        color: theme.secondary,
        height: 44,
        borderWidth: 1,
        borderColor: '#ababab',
        borderRadius: 8,
        padding: 10,
        backgroundColor: theme.primary,
    },
    btn: {
        backgroundColor: theme.accent,
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
        backgroundColor: theme.primary,
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
        color: theme.secondary,
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

        backgroundColor: theme.primary,
        borderRadius: 30,
        width: 50,
        aspectRatio: 1,

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
        backgroundColor: theme.primary,
        borderRadius: 24,
        padding: 24,
        marginVertical: 24,

        elevation: 2,
        shadowColor: theme.secondary,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        alignItems: 'center'
    },
    p: {
        color: theme.secondary,
        fontFamily: 'mon'
    }
})