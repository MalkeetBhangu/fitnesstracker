import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { ChartInfo, ChartSeriesItem } from '@src/types/ProgressTypes'
import React, { useMemo, useState } from 'react'
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg'
import { getMonthsList } from '../ProgressConstant'

export interface WeightChartCardProps extends Partial<ChartInfo> {
    data?: ChartInfo
    chart?: ChartInfo
    style?: StyleProp<ViewStyle>
}

const Y_TICKS = [90, 85, 80, 75, 70]
const MIN_Y = 70
const MAX_Y = 90
const CHART_HEIGHT = getHeight(160)

const WeightChartCard: React.FC<WeightChartCardProps> = (props) => {
    const { data, chart, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const chartInfo: ChartInfo | undefined =
        data || chart || (props.ranges !== undefined ? (props as ChartInfo) : undefined)

    const [selectedRange, setSelectedRange] = useState<string>(chartInfo?.defaultRange || '6M')
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [chartAreaWidth, setChartAreaWidth] = useState<number>(getWidth(260))

    if (!chartInfo) return null

    const ranges = chartInfo.ranges
    const series: ChartSeriesItem[] = chartInfo.seriesByRange?.[selectedRange] || []
    const monthsList = getMonthsList(languageCode)

    const points = useMemo(() => {
        if (!series || series.length === 0) return []
        const usableWidth = chartAreaWidth - getWidth(20)
        const stepX = series.length > 1 ? usableWidth / (series.length - 1) : usableWidth

        return series.map((item, index) => {
            const x = getWidth(10) + index * stepX
            const clampedVal = Math.max(MIN_Y, Math.min(MAX_Y, item.avgWeight))
            const yPercent = (clampedVal - MIN_Y) / (MAX_Y - MIN_Y)
            const y = CHART_HEIGHT - yPercent * (CHART_HEIGHT - getHeight(20)) - getHeight(10)
            return { x, y, item, index }
        })
    }, [series, chartAreaWidth])

    const activePoint = useMemo(() => {
        if (selectedIndex !== null && points[selectedIndex]) {
            return points[selectedIndex]
        }
        if (chartInfo.highlight && selectedRange === chartInfo.highlight.range) {
            const match = points.find((p) => p.item.date === chartInfo.highlight.date)
            if (match) return match
        }
        return points[Math.floor(points.length / 2)] || points[0]
    }, [points, selectedIndex, selectedRange, chartInfo.highlight])

    const pathD = useMemo(() => {
        if (points.length === 0) return ''
        if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

        let d = `M ${points[0].x} ${points[0].y}`
        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i]
            const next = points[i + 1]
            const cpX1 = curr.x + (next.x - curr.x) / 2
            const cpY1 = curr.y
            const cpX2 = curr.x + (next.x - curr.x) / 2
            const cpY2 = next.y
            d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`
        }
        return d
    }, [points])

    const xLabels = useMemo(() => {
        if (!series || series.length === 0) return []
        return series.map((item) => {
            try {
                const parts = item.date.split('-')
                if (parts.length >= 2) {
                    const monthIdx = parseInt(parts[1], 10) - 1
                    return monthsList?.[monthIdx] ?? ''
                }
                const d = new Date(item.date)
                return monthsList?.[d.getUTCMonth()] ?? ''
            } catch {
                return item.date
            }
        })
    }, [series, monthsList])

    const tooltipLabel = useMemo(() => {
        if (!activePoint) return { avg: '', date: '' }
        if (chartInfo.highlight && activePoint.item.date === chartInfo.highlight.date) {
            return {
                avg: `${activePoint.item.avgWeight} kg`,
                date: chartInfo.highlight.label,
            }
        }
        try {
            const d = new Date(activePoint.item.date)
            const day = d.getUTCDate()
            const month = monthsList?.[d.getUTCMonth()] ?? ''
            const year = d.getUTCFullYear()
            return {
                avg: `${activePoint.item.avgWeight} kg`,
                date: `${day} ${month} ${year}`,
            }
        } catch {
            return {
                avg: `${activePoint.item.avgWeight} kg`,
                date: activePoint.item.date,
            }
        }
    }, [activePoint, chartInfo.highlight, monthsList])

    return (
        <View style={[styles.container, style]}>
            <View style={styles.rangeSelectorContainer}>
                {ranges.map((range) => {
                    const isActive = range === selectedRange
                    return (
                        <Pressable
                            key={range}
                            onPress={() => {
                                setSelectedRange(range)
                                setSelectedIndex(null)
                            }}
                            style={[
                                styles.rangeButton,
                                isActive && styles.rangeButtonActive,
                            ]}
                        >
                            <TextView text={range} style={[styles.rangeButtonText, isActive && styles.rangeButtonTextActive,]} />
                        </Pressable>
                    )
                })}
            </View>

            <View style={styles.chartWrapper}>
                <View style={styles.yAxisContainer}>
                    {Y_TICKS.map((tick) => <TextView key={`ytick_${tick}`} text={`${tick}`} style={styles.yAxisText} />)}
                </View>

                <View
                    style={styles.svgCanvasContainer}
                    onLayout={(e) => {
                        const width = e.nativeEvent.layout.width
                        if (width > 0) setChartAreaWidth(width)
                    }}
                >
                    <Svg width={chartAreaWidth} height={CHART_HEIGHT}>
                        <Defs>
                            <LinearGradient id="activeLineGradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={colors.primaryBlue} stopOpacity="0.5" />
                                <Stop offset="0.8" stopColor={colors.primaryBlue} stopOpacity="0.05" />
                                <Stop offset="1" stopColor={colors.primaryBlue} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>

                        {Y_TICKS.map((tick, index) => {
                            const yPercent = (tick - MIN_Y) / (MAX_Y - MIN_Y)
                            const y = CHART_HEIGHT - yPercent * (CHART_HEIGHT - getHeight(20)) - getHeight(10)
                            return <Line key={`grid_${tick}`} x1={0} y1={y} x2={chartAreaWidth} y2={y} stroke={colors.gridLine} strokeWidth={1} />
                        })}
                        {activePoint && <Line x1={activePoint.x} y1={activePoint.y} x2={activePoint.x} y2={CHART_HEIGHT} stroke="url(#activeLineGradient)" strokeWidth={2.5} />}
                        {pathD && <Path d={pathD} fill="none" stroke={colors.primaryBlue} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
                        {activePoint && <Circle cx={activePoint.x} cy={activePoint.y} r={4.5} fill={colors.white} stroke={colors.primaryBlue} strokeWidth={2.5} />}
                    </Svg>

                    {activePoint && (
                        <View
                            pointerEvents="none"
                            style={[
                                styles.tooltipBubble,
                                {
                                    left: Math.max(
                                        0,
                                        Math.min(
                                            chartAreaWidth - getWidth(90),
                                            activePoint.x - getWidth(45)
                                        )
                                    ),
                                    top: Math.max(0, activePoint.y - getHeight(58)),
                                },
                            ]}
                        >
                            <TextView text={t.progress?.average} style={styles.tooltipSubText} />
                            <View style={styles.tooltipWeightRow}>
                                <TextView text={`${activePoint.item.avgWeight}`} style={styles.tooltipWeightValue} />
                                <TextView text={` ${t.progress?.kg}`} style={styles.tooltipWeightUnit} />
                            </View>
                            <TextView text={tooltipLabel.date} style={styles.tooltipDateText} numberOfLines={1} />
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.xAxisContainer}>
                {xLabels.map((lbl, idx) => <TextView key={`xlabel_${idx}`} text={lbl} style={styles.xAxisText} />)}
            </View>
        </View>
    )
}

export default WeightChartCard

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
    rangeSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: colors.tabHighlight,
        borderRadius: getWidth(16),
        padding: getWidth(3),
        marginBottom: getHeight(16),
    },
    rangeButton: {
        flex: 1,
        paddingVertical: getHeight(7),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getWidth(14),
    },
    rangeButtonActive: {
        backgroundColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    rangeButtonText: {
        fontSize: getHeight(13),
        fontWeight: '500',
        color: colors.textSecondary,
    },
    rangeButtonTextActive: {
        color: colors.black,
        fontWeight: '700',
    },
    chartWrapper: {
        flexDirection: 'row',
        height: CHART_HEIGHT,
    },
    yAxisContainer: {
        justifyContent: 'space-between',
        paddingVertical: getHeight(6),
        paddingRight: getWidth(8),
        alignItems: 'flex-end',
        width: getWidth(26),
    },
    yAxisText: {
        fontSize: getHeight(11),
        color: colors.textSecondary,
        fontWeight: '400',
    },
    svgCanvasContainer: {
        flex: 1,
        position: 'relative',
    },
    tooltipBubble: {
        position: 'absolute',
        backgroundColor: colors.white,
        borderRadius: getWidth(10),
        paddingHorizontal: getWidth(8),
        paddingVertical: getHeight(4),
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 0.5,
        borderColor: colors.borderGrey,
        zIndex: 10,
    },
    tooltipSubText: {
        fontSize: getHeight(9),
        color: colors.textSecondary,
        fontWeight: '400',
    },
    tooltipWeightRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    tooltipWeightValue: {
        fontSize: getHeight(12),
        fontWeight: '700',
        color: colors.black,
    },
    tooltipWeightUnit: {
        fontSize: getHeight(9),
        fontWeight: '500',
        color: colors.textSecondary,
    },
    tooltipDateText: {
        fontSize: getHeight(9),
        color: colors.textSecondary,
        fontWeight: '400',
    },
    xAxisContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: getWidth(32),
        paddingRight: getWidth(6),
        marginTop: getHeight(8),
    },
    xAxisText: {
        fontSize: getHeight(11),
        color: colors.textSecondary,
        fontWeight: '400',
    },
})
