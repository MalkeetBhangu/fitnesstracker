import { useProgress } from '@src/config/useProgress'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight } from '@src/libs/StyleHelper'
import Header from '@src/sharedComponents/Header'
import LanguageModal from '@src/sharedComponents/LanguageModal'
import Loader from '@src/sharedComponents/Loader'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { Section } from '@src/types/ProgressTypes'
import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import CurrentWeightCard from './components/CurrentWeightCard'
import GoalCard from './components/GoalCard'
import WeightChartCard from './components/WeightChartCard'
import BmiCard from './components/BmiCard'
import RecentLogsCard from './components/RecentLogsCard'
import WalkthroughCard from './components/WalkthroughCard'
import { PROGRESS_SECTION_TYPES } from './ProgressConstant'

const Progress: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState<boolean>(false)
    const t = getTexts(languageCode)
    const { data: sections, isLoading } = useProgress()

    const renderItem = ({ item }: { item: Section }) => {
        switch (item.type) {
            case PROGRESS_SECTION_TYPES.WEIGHT:
                return <CurrentWeightCard data={item.data} onEdit={() => { }} />

            case PROGRESS_SECTION_TYPES.GOAL:
                return <GoalCard data={item.data} onEdit={() => { }} />

            case PROGRESS_SECTION_TYPES.CHART:
                return <WeightChartCard data={item.data} />

            case PROGRESS_SECTION_TYPES.BMI:
                return <BmiCard data={item.data} onEditHeight={() => { }} />

            case PROGRESS_SECTION_TYPES.RECENT_LOGS:
                return <RecentLogsCard data={item.data} onViewAll={() => { }} />

            case PROGRESS_SECTION_TYPES.WALKTHROUGH:
                return <WalkthroughCard data={item.data} onItemPress={() => { }} />

            default:
                return null
        }
    }

    if (isLoading && !sections) return <Loader />

    return (
        <View style={styles.container}>
            <Header title={t.tabs.progress} onLeftPress={() => { }} onRightPress={() => setIsLanguageModalVisible(true)} />

            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={3}
                maxToRenderPerBatch={1}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            />

            <LanguageModal visible={isLanguageModalVisible} onClose={() => setIsLanguageModalVisible(false)} />
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