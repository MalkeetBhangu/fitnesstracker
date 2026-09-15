import { playIcon as PlayIcon } from '@assets/index'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import { WalkthroughItem } from '@src/types/ProgressTypes'
import React from 'react'
import { FlatList, Image, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { FALLBACK_THUMBNAILS } from '../ProgressConstant'

export interface WalkthroughCardProps {
    data?: WalkthroughItem[]
    items?: WalkthroughItem[]
    onItemPress?: (item: WalkthroughItem) => void
    style?: StyleProp<ViewStyle>
}



const WalkthroughCard: React.FC<WalkthroughCardProps> = (props) => {
    const { data, items, onItemPress, style } = props
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const walkthroughItems = data || items

    if (!walkthroughItems || walkthroughItems.length === 0) return null

    const renderItem = ({ item }: { item: WalkthroughItem }) => {
        const imageUri =
            item.thumbnailUrl && !item.thumbnailUrl.includes('example.com')
                ? item.thumbnailUrl
                : FALLBACK_THUMBNAILS[item.id] || FALLBACK_THUMBNAILS.wt_1

        return (
            <Pressable
                onPress={() => onItemPress?.(item)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
                <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: imageUri }} style={styles.thumbnailImage} resizeMode="cover" />
                    <View style={styles.playButton}>
                        <PlayIcon width={getWidth(24)} height={getWidth(24)} stroke={colors.white} style={styles.playIcon} />
                    </View>
                </View>
                <View style={styles.tagPill}>
                    <TextView text={item.tag} style={styles.tagText} />
                </View>
                <TextView text={item.title} style={styles.cardTitle} numberOfLines={2} />
            </Pressable>
        )
    }

    return (
        <View style={[styles.container, style]}>
            <TextView text={t.progress?.walkthrough} style={styles.sectionTitle} />

            <FlatList
                data={walkthroughItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={2}
                maxToRenderPerBatch={1}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    )
}

export default WalkthroughCard

const styles = StyleSheet.create({
    container: {
        marginTop: getHeight(20),
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.black,
        paddingHorizontal: getWidth(16),
        marginBottom: getHeight(14),
    },
    listContent: {
        paddingHorizontal: getWidth(16),
        paddingBottom: getHeight(12),
    },
    separator: {
        width: getWidth(14),
    },
    card: {
        width: getWidth(300),
        backgroundColor: colors.white,
        borderRadius: getWidth(24),
        padding: getWidth(16),
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 3,
    },
    cardPressed: {
        opacity: 0.92,
        transform: [{ scale: 0.985 }],
    },
    thumbnailContainer: {
        width: '100%',
        height: getHeight(160),
        borderRadius: getWidth(18),
        overflow: 'hidden',
        backgroundColor: colors.subCardBg,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnailImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    playButton: {
        width: getWidth(54),
        height: getWidth(54),
        borderRadius: getWidth(27),
        backgroundColor: colors.playButtonBg,
        borderWidth: 2,
        borderColor: colors.playButtonBorder,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    playIcon: {
        marginLeft: getWidth(2),
    },
    tagPill: {
        marginTop: getHeight(14),
        backgroundColor: colors.subCardBg,
        paddingHorizontal: getWidth(14),
        paddingVertical: getHeight(6),
        borderRadius: getWidth(12),
        alignSelf: 'flex-start',
    },
    tagText: {
        fontSize: getHeight(13),
        fontWeight: '500',
        color: colors.darkGrey,
    },
    cardTitle: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.black,
        lineHeight: getHeight(23),
        marginTop: getHeight(12),
        marginBottom: getHeight(4),
    },
})
