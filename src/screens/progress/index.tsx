import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import Header from '@src/sharedComponents/Header'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Progress: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)

    return (
        <View style={styles.container}>
            <Header
                title={t.tabs.progress}
                onLeftPress={() => console.log('Back pressed')}
                onRightPress={() => console.log('More options pressed')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
})

export default Progress