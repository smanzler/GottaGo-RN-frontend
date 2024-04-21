import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.overlay} pointerEvents='none'>
        <ActivityIndicator size='large' />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5FCFF88',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
