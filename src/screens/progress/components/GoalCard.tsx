import { goalTarget as GoalTargetIcon } from '@assets/index'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { GoalInfo } from '@src/types/ProgressTypes'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { getMonthsList } from '../ProgressConstant'

export interface GoalCardProps extends Partial<GoalInfo> {
    data?: GoalInfo
    goal?: GoalInfo
    onEdit?: () => void
    style?: StyleProp<ViewStyle>
}

const formatGoalDate = (dateString?: string, months?: string[]): { dayMonth: string; year: string } => {
    if (!dateString) return { dayMonth: '', year: '' }
    try {
        const parts = dateString.split('-')
        if (parts.length === 3) {
            const year = parts[0]
            const monthIdx = parseInt(parts[1], 10) - 1
            const day = parseInt(parts[2], 10)
            const monthName = months?.[monthIdx] ?? ''
            return { dayMonth: `${day} ${monthName}`, year }
        }
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
            const day = date.getUTCDate()
            const month = months?.[date.getUTCMonth()] ?? ''
            const year = `${date.getUTCFullYear()}`
            return { dayMonth: `${day} ${month}`, year }
        }
        return { dayMonth: dateString, year: '' }
    } catch {
        return { dayMonth: dateString, year: '' }
    }
}

const GoalCard: React.FC<GoalCardProps> = (props) => {
    const { data, goal, onEdit, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const goalInfo: GoalInfo | undefined =
        data || goal || (props.target !== undefined ? (props as GoalInfo) : undefined)

    if (!goalInfo) return null

    const monthsList = getMonthsList(languageCode)
    const { dayMonth, year } = formatGoalDate(goalInfo.targetDate, monthsList)

    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerRow}>
                <View style={styles.iconContainer}>
                    <GoalTargetIcon width={getWidth(24)} height={getWidth(24)} />
                </View>

                <View style={styles.titleContainer}>
                    <TextView text={t.progress?.yourGoal} style={styles.title} />
                    <TextView text={t.progress?.trackingProgress} style={styles.subtitle} numberOfLines={2} />
                </View>

                <Pressable onPress={onEdit} style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed,]}
                >
                    <TextView text={t.progress?.edit} style={styles.editButtonText} />
                </Pressable>
            </View>

            <View style={styles.subCardsRow}>
                <View style={styles.subCard}>
                    <TextView text={t.progress?.target} style={styles.subCardLabel} />
                    <TextView text={`${goalInfo.target}`} style={styles.subCardValue} />
                    <TextView text={goalInfo.unit} style={styles.subCardSubText} />
                </View>

                <View style={styles.subCard}>
                    <TextView text={t.progress?.by} style={styles.subCardLabel} />
                    <TextView text={dayMonth} style={styles.subCardValue} numberOfLines={1} />
                    <TextView text={year} style={styles.subCardSubText} />
                </View>

                <View style={styles.subCard}>
                    <TextView text={t.progress?.pace} style={styles.subCardLabel} />
                    <TextView text={goalInfo.pace?.label} style={styles.subCardValue} numberOfLines={1} />
                    <TextView text={`${goalInfo.pace?.value} ${goalInfo.pace?.unit}`} style={styles.subCardSubText} numberOfLines={1} />
                </View>
            </View>
        </View>
    )
}

export default GoalCard

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: getWidth(18),
        paddingHorizontal: getWidth(16),
        paddingVertical: getHeight(16),
        marginHorizontal: getWidth(16),
        marginTop: getHeight(12),
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: getWidth(42),
        height: getWidth(42),
        borderRadius: getWidth(12),
        backgroundColor: colors.goalIconBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: getWidth(10),
    },
    titleContainer: {
        flex: 1,
        marginRight: getWidth(8),
    },
    title: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.black,
    },
    subtitle: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        fontWeight: '400',
        marginTop: getHeight(3),
        lineHeight: getHeight(17),
    },
    editButton: {
        paddingHorizontal: getWidth(16),
        paddingVertical: getHeight(5),
        borderRadius: getWidth(16),
        borderWidth: 1,
        borderColor: colors.borderGrey,
        backgroundColor: colors.white,
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },
    editButtonText: {
        fontSize: getHeight(13),
        color: colors.darkGrey,
        fontWeight: '500',
    },
    subCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getHeight(16),
    },
    subCard: {
        flex: 1,
        backgroundColor: colors.subCardBg,
        borderRadius: getWidth(12),
        paddingHorizontal: getWidth(12),
        paddingVertical: getHeight(12),
        marginHorizontal: getWidth(3),
    },
    subCardLabel: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        fontWeight: '400',
    },
    subCardValue: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.black,
        marginTop: getHeight(6),
    },
    subCardSubText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        fontWeight: '500',
        marginTop: getHeight(3),
    },
})
