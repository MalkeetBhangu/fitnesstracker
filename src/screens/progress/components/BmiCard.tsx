import { scaleIcon as ScaleIcon } from '@assets/index'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { BmiInfo } from '@src/types/ProgressTypes'
import React, { useState } from 'react'
import { LayoutChangeEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export interface BmiCardProps extends Partial<BmiInfo> {
    data?: BmiInfo
    bmi?: BmiInfo
    onEditHeight?: () => void
    style?: StyleProp<ViewStyle>
}

const BmiCard: React.FC<BmiCardProps> = (props) => {
    const { data, bmi, onEditHeight, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const bmiInfo: BmiInfo | undefined =
        data || bmi || (props.value !== undefined ? (props as BmiInfo) : undefined)

    const [gaugeWidth, setGaugeWidth] = useState<number>(0)

    if (!bmiInfo) return null

    const handleGaugeLayout = (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width
        if (width > 0) setGaugeWidth(width)
    }

    const calculateIndicatorLeft = (): number => {
        if (gaugeWidth <= 0) return 0
        const gapTotal = getWidth(4) * 3
        const availableWidth = gaugeWidth - gapTotal
        const segmentWidth = availableWidth / 4

        const val = bmiInfo.value
        let leftPos = 0

        if (val <= 18.5) {
            const ratio = Math.max(0, val) / 18.5
            leftPos = ratio * segmentWidth
        } else if (val <= 25) {
            const ratio = (val - 18.5) / (25 - 18.5)
            leftPos = segmentWidth + getWidth(4) + ratio * segmentWidth
        } else if (val <= 30) {
            const ratio = (val - 25) / (30 - 25)
            leftPos = segmentWidth * 2 + getWidth(4) * 2 + ratio * segmentWidth
        } else {
            const ratio = Math.min(1, (val - 30) / 10)
            leftPos = segmentWidth * 3 + getWidth(4) * 3 + ratio * segmentWidth
        }

        return Math.max(0, Math.min(gaugeWidth - getWidth(3.5), leftPos))
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerRow}>
                <View style={styles.iconContainer}>
                    <ScaleIcon width={getWidth(20)} height={getWidth(20)} />
                </View>
                <TextView text={t.progress?.bmi} style={styles.headerTitle} />
            </View>

            <View style={styles.valueRow}>
                <TextView text={`${bmiInfo.value}`} style={styles.bmiValue} />
                <View style={styles.statusBadge}>
                    <TextView text={`✓ ${t.progress?.normal}`} style={styles.statusBadgeText} />
                </View>
            </View>

            <TextView text={t.progress?.bmiHealthyRange} style={styles.subtitle} />

            <View style={styles.scaleContainer}>
                <View style={styles.gaugeBarRow} onLayout={handleGaugeLayout}>
                    <View style={[styles.gaugeSegment, { backgroundColor: colors.bmiBandUnderweight }]} />
                    <View style={[styles.gaugeSegment, { backgroundColor: colors.bmiBandNormal }]} />
                    <View style={[styles.gaugeSegment, { backgroundColor: colors.bmiBandOverweight }]} />
                    <View style={[styles.gaugeSegment, { backgroundColor: colors.bmiBandObese, flex: 1.5 }]} />

                    {gaugeWidth > 0 && (
                        <View
                            style={[
                                styles.indicatorPin,
                                { left: calculateIndicatorLeft() },
                            ]}
                        />
                    )}
                </View>

                <View style={styles.ticksRow}>
                    {(bmiInfo.scale ? [bmiInfo.scale.min, ...bmiInfo.scale.bands, bmiInfo.scale.max] : [0, 18.5, 25, 30]).map((tickVal, index) => (
                        <TextView key={`tick_${index}`} text={`${tickVal}`} style={styles.tickText} />
                    ))}
                </View>
            </View>

            <View style={styles.heightBox}>
                <TextView text={`${t.progress?.height}: ${bmiInfo.heightCm}${t.progress?.cm}`} style={styles.heightText} />
                <Pressable onPress={onEditHeight} style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed,]}>
                    <TextView text={t.progress?.edit} style={styles.editButtonText} />
                </Pressable>
            </View>

            <TextView text={t.progress?.bmiCalculatedNote} style={styles.footerNote} />
        </View>
    )
}

export default BmiCard

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
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: getHeight(12),
    },
    bmiValue: {
        fontSize: getHeight(34),
        fontWeight: '700',
        color: colors.black,
    },
    statusBadge: {
        backgroundColor: colors.badgeGreenBg,
        paddingHorizontal: getWidth(8),
        paddingVertical: getHeight(3),
        borderRadius: getWidth(8),
        marginLeft: getWidth(10),
    },
    statusBadgeText: {
        fontSize: getHeight(12),
        fontWeight: '600',
        color: colors.badgeGreenText,
    },
    subtitle: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        fontWeight: '400',
        marginTop: getHeight(4),
        marginBottom: getHeight(16),
    },
    scaleContainer: {
        marginBottom: getHeight(14),
    },
    gaugeBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        height: getHeight(22),
    },
    gaugeSegment: {
        flex: 1,
        height: getHeight(8),
        borderRadius: getWidth(4),
        marginRight: getWidth(4),
    },
    indicatorPin: {
        position: 'absolute',
        width: getWidth(3.5),
        height: getHeight(20),
        backgroundColor: colors.black,
        borderRadius: getWidth(2),
        top: getHeight(1),
        zIndex: 2,
    },
    ticksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getHeight(4),
        paddingRight: getWidth(30),
    },
    tickText: {
        fontSize: getHeight(11),
        color: colors.textSecondary,
        fontWeight: '400',
    },
    heightBox: {
        backgroundColor: colors.subCardBg,
        borderRadius: getWidth(12),
        paddingHorizontal: getWidth(14),
        paddingVertical: getHeight(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getHeight(4),
    },
    heightText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.black,
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
    footerNote: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        fontWeight: '400',
        marginTop: getHeight(10),
    },
})
