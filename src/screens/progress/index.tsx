import { useProgress } from '@src/config/useProgress'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight } from '@src/libs/StyleHelper'
import Header from '@src/sharedComponents/Header'
import Loader from '@src/sharedComponents/Loader'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { Section } from '@src/types/ProgressTypes'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import CurrentWeightCard from './components/CurrentWeightCard'
import GoalCard from './components/GoalCard'
import { PROGRESS_SECTION_TYPES } from './ProgressConstant'

const Progress: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const { data: sections, isLoading } = useProgress()

    const renderItem = ({ item }: { item: Section }) => {
        switch (item.type) {
            case PROGRESS_SECTION_TYPES.WEIGHT:
                return <CurrentWeightCard data={item.data} onEdit={() => { }} />

            case PROGRESS_SECTION_TYPES.GOAL:
                return <GoalCard data={item.data} onEdit={() => { }} />

            default:
                return null
        }
    }

    if (isLoading && !sections) return <Loader />

    return (
        <View style={styles.container}>
            <Header title={t.tabs.progress} onLeftPress={() => { }} onRightPress={() => { }} />

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    scrollContent: {
        paddingBottom: getHeight(120),
    },
})

export default Progress