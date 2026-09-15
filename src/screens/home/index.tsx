import colors from '@src/tokens/Colors'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Home: React.FC = () => {
    return (
        <View>
            <View>
                <Text>Learn</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
})

export default Home