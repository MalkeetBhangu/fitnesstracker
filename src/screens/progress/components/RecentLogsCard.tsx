import { arrowDown as ArrowDownIcon, arrowUp as ArrowUpIcon, journal as JournalIcon } from '@assets/index'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { RecentLogItem } from '@src/types/ProgressTypes'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { getDaysList, getMonthsList } from '../ProgressConstant'

export interface RecentLogsCardProps {
    data?: RecentLogItem[]
    logs?: RecentLogItem[]
    onViewAll?: () => void
    style?: StyleProp<ViewStyle>
}

const formatLogDate = (dateString?: string, days?: string[], months?: string[]): string => {
    if (!dateString) return ''
    try {
        const parts = dateString.split('-')
        let date: Date
        if (parts.length === 3) {
            date = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)))
        } else {
            date = new Date(dateString)
        }
        if (isNaN(date.getTime())) return dateString
        const dayOfWeek = days?.[date.getUTCDay()] ?? ''
        const dayOfMonth = date.getUTCDate()
        const monthName = months?.[date.getUTCMonth()] ?? ''
        const year = date.getUTCFullYear()
        return `${dayOfWeek} ${dayOfMonth} ${monthName} ${year}`.trim()
    } catch {
        return dateString
    }
}

const RecentLogsCard: React.FC<RecentLogsCardProps> = (props) => {
    const { data, logs, onViewAll, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const logItems = data || logs || []

    if (!logItems || logItems.length === 0) return null

    const monthsList = getMonthsList(languageCode)
    const daysList = getDaysList(languageCode)

    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <JournalIcon width={getWidth(20)} height={getWidth(20)} fill={colors.darkGrey} />
                    </View>
                    <TextView text={t.progress?.recentLogs} style={styles.headerTitle} />
                </View>

                <Pressable onPress={onViewAll} hitSlop={8}>
                    <TextView text={t.progress?.viewAll} style={styles.viewAllText} />
                </Pressable>
            </View>

            <View style={styles.logsList}>
                {logItems.map((item) => {
                    const isUp = item.trend === 'up'
                    const isDown = item.trend === 'down'

                    const badgeBg = isUp ? colors.badgeOrangeBg : isDown ? colors.badgeGreenBg : colors.lightGrey
                    const badgeTextColor = isUp ? colors.badgeOrangeText : isDown ? colors.badgeGreenText : colors.textSecondary

                    const formattedUnit = item.unit
                    const signPrefix = isUp ? '+' : ''
                    const formattedDelta = `${signPrefix}${Math.abs(item.delta)} ${item.unit}`
                    const dateStr = formatLogDate(item.loggedAt, daysList, monthsList)

                    return (
                        <View key={item.id} style={styles.logItemContainer}>
                            <View style={styles.logItemLeft}>
                                <View style={styles.logItemValues}>
                                    <TextView text={`${item.weight} ${formattedUnit}`} style={styles.weightText} />
                                    {item.waistCm && <TextView text={`  ${t.progress?.waist} ${item.waistCm} ${t.progress?.cm}`} style={styles.waistText} />}
                                </View>
                                <TextView text={dateStr} style={styles.dateText} />
                            </View>

                            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                                {isDown ? (
                                    <ArrowDownIcon width={getWidth(12)} height={getHeight(8)} stroke={badgeTextColor} style={styles.badgeIcon} />
                                ) : isUp ? (
                                    <ArrowUpIcon width={getWidth(12)} height={getHeight(8)} stroke={badgeTextColor} style={styles.badgeIcon} />
                                ) : null}
                                <TextView text={formattedDelta} style={[styles.badgeText, { color: badgeTextColor }]} />
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default RecentLogsCard

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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: getWidth(36),
        height: getWidth(36),
        borderRadius: getWidth(10),
        backgroundColor: colors.bmiScaleIconBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: getWidth(10),
    },
    headerTitle: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.black,
    },
    viewAllText: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.primaryBlue,
    },
    logsList: {
        marginTop: getHeight(6),
    },
    logItemContainer: {
        backgroundColor: colors.subCardBg,
        borderRadius: getWidth(12),
        paddingHorizontal: getWidth(14),
        paddingVertical: getHeight(12),
        marginTop: getHeight(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logItemLeft: {
        flex: 1,
        marginRight: getWidth(10),
    },
    logItemValues: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    weightText: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.black,
    },
    waistText: {
        fontSize: getHeight(13),
        fontWeight: '400',
        color: colors.textSecondary,
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
    dateText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        fontWeight: '400',
        marginTop: getHeight(4),
    },
})
