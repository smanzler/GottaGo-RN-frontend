import { View } from "react-native";
import Colors from "../constants/Colors";

const Curve = () => (
    <View style={{
        position: 'absolute',
        backgroundColor: 'white',
        width: 20,
        height: 35,
        zIndex: -3
    }}>
        <View style={{
            position: 'absolute',
            backgroundColor: 'white',
            height: 25,
            borderLeftWidth: 2,
            borderLeftColor: '#bbb',
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
        }} />
        <View style={{
            position: 'absolute',
            backgroundColor: 'white',
            width: 10,
            top: 0,
            bottom: 0,
            right: 0,
            zIndex: -1,
        }} />
        <View style={{
            backgroundColor: 'white',
            position: 'absolute',
            aspectRatio: 1,
            borderRadius: 10,
            width: 20,
            borderWidth: 2,
            borderColor: '#bbb',
            zIndex: -2,
            bottom: 0,
        }} />
    </View>

);

export default Curve;