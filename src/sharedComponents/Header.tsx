import { backIcon as BackIcon, moreIcon as MoreIcon } from '@assets/index'
import { useNavigation } from '@react-navigation/native'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import colors from '@src/tokens/Colors'
import React from 'react'
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle, } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface HeaderProps {
    title?: string
    showLeftButton?: boolean
    showRightButton?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    onLeftPress?: () => void
    onRightPress?: () => void
    style?: StyleProp<ViewStyle>
    titleStyle?: StyleProp<TextStyle>
    iconColor?: string
    buttonBackgroundColor?: string
}

const Header: React.FC<HeaderProps> = ({ title, showLeftButton = true, showRightButton = true, leftIcon, rightIcon, onLeftPress, onRightPress, style, titleStyle, iconColor = colors.black, buttonBackgroundColor = colors.tabHighlight, }) => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    const handleLeftPress = () => {
        if (onLeftPress) onLeftPress()
        else if (navigation.canGoBack()) navigation.goBack()
    }

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top > 0 ? insets.top + getHeight(24) : getHeight(12) },
                style,
            ]}
        >
            {showLeftButton ? (
                <Pressable
                    onPress={handleLeftPress}
                    style={({ pressed }) => [
                        styles.iconButton,
                        { backgroundColor: buttonBackgroundColor },
                        pressed && styles.buttonPressed,
                    ]}
                >
                    {leftIcon ?? (
                        <BackIcon
                            width={getWidth(10)}
                            height={getHeight(16)}
                            stroke={iconColor}
                        />
                    )}
                </Pressable>
            ) : (
                <View style={styles.buttonPlaceholder} />
            )}

            <View style={styles.titleContainer}>
                {title && <TextView numberOfLines={1} text={title} style={[styles.title, titleStyle]} />}
            </View>

            {showRightButton ? (
                <Pressable
                    onPress={onRightPress}
                    style={({ pressed }) => [
                        styles.iconButton,
                        { backgroundColor: buttonBackgroundColor },
                        pressed && styles.buttonPressed,
                    ]}
                >
                    {rightIcon ?? (
                        <MoreIcon
                            width={getWidth(18)}
                            height={getHeight(6)}
                            fill={iconColor}
                        />
                    )}
                </Pressable>
            ) : (
                <View style={styles.buttonPlaceholder} />
            )}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: getWidth(18),
        paddingBottom: getHeight(12),
        backgroundColor: colors.screenBackground,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: getWidth(10),
    },
    title: {
        fontSize: getHeight(19),
        fontWeight: '700',
        color: colors.black,
        textAlign: 'center',
    },
    iconButton: {
        width: getWidth(44),
        height: getWidth(44),
        borderRadius: getWidth(22),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    buttonPlaceholder: {
        width: getWidth(44),
        height: getWidth(44),
    },
})
