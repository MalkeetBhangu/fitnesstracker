import colors from '@tokens/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


const Loader: React.FC = () => {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
    );
};

export default Loader;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: colors.screenBackground,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },

});