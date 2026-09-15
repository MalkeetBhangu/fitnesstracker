import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { WeightInfo } from '@src/types/ProgressTypes'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { getMonthsList } from '../ProgressConstant'
import { arrowUp as ArrowUpIcon } from '@assets/index'

export interface CurrentWeightCardProps extends Partial<WeightInfo> {
    data?: WeightInfo
    currentWeight?: WeightInfo
    onEdit?: () => void
    style?: StyleProp<ViewStyle>
}

const formatLastLoggedDate = (dateString?: string, months?: string[]): string => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString
        const day = date.getUTCDate()
        const month = months?.[date.getUTCMonth()] ?? ''
        const year = date.getUTCFullYear()
        return `${day} ${month} ${year}`.trim()
    } catch {
        return dateString
    }
}

const CurrentWeightCard: React.FC<CurrentWeightCardProps> = (props) => {
    const { data, currentWeight, onEdit, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const weightInfo: WeightInfo | undefined =
        data || currentWeight || (props.value !== undefined ? (props as WeightInfo) : undefined)

    if (!weightInfo) return null

    const isUp = weightInfo.trend === 'up'
    const isDown = weightInfo.trend === 'down'

    const badgeBg = isUp ? colors.badgeOrangeBg : isDown ? colors.badgeGreenBg : colors.lightGrey
    const badgeTextColor = isUp ? colors.badgeOrangeText : isDown ? colors.badgeGreenText : colors.textSecondary

    const signPrefix = isUp ? '+' : isDown ? '-' : ''
    const formattedDelta = `${signPrefix}${Math.abs(weightInfo.delta)} ${weightInfo.unit}`

    const monthsList = getMonthsList(languageCode)
    const lastLoggedDateStr = formatLastLoggedDate(weightInfo.lastLoggedAt, monthsList)

    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerRow}>
                <TextView text={t.progress?.currentWeight} style={styles.headerTitle} />
                <Pressable
                    onPress={onEdit}
                    style={({ pressed }) => [
                        styles.editButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <TextView text={t.progress?.edit} style={styles.editButtonText} />
                </Pressable>
            </View>

            <View style={styles.valueRow}>
                <TextView text={`${weightInfo.value}`} style={styles.weightValue} />
                <TextView text={weightInfo.unit} style={styles.weightUnit} />
                <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                    <ArrowUpIcon width={getWidth(12)} height={getHeight(8)} stroke={badgeTextColor} style={styles.badgeIcon} />
                    <TextView text={formattedDelta} style={[styles.badgeText, { color: badgeTextColor }]} />
                </View>
            </View>

            {lastLoggedDateStr && <TextView text={`${t.progress?.lastLogged} ${lastLoggedDateStr}`} style={styles.lastLoggedText} />}
        </View>
    )
}

export default CurrentWeightCard

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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        fontWeight: '400',
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
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getHeight(8),
        marginBottom: getHeight(8),
    },
    weightValue: {
        fontSize: getHeight(34),
        fontWeight: '700',
        color: colors.black,
    },
    weightUnit: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: colors.darkGrey,
        marginLeft: getWidth(6),
        marginRight: getWidth(10),
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: getWidth(8),
        paddingVertical: getHeight(3),
        borderRadius: getWidth(8),
    },
    badgeIcon: {
        marginRight: getWidth(4),
    },
    badgeText: {
        fontSize: getHeight(12),
        fontWeight: '600',
    },
    lastLoggedText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        fontWeight: '400',
    },
})
