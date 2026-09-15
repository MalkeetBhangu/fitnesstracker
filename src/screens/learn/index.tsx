import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const Learn: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)

    return (
        <View style={styles.container}>
            <TextView text={t.tabs?.learn} style={styles.text} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: getHeight(20),
        fontWeight: '700',
        color: colors.black,
    },
})

export default Learn