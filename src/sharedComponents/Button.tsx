import { getHeight, getWidth } from '@src/libs/StyleHelper'
import colors from '@src/tokens/Colors'
import radius from '@src/tokens/Radius'
import React from 'react'
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
    title: string
    isDisabled?: boolean
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
}

export default function Button({ title, isDisabled = false, style, textStyle, disabled, ...props }: ButtonProps) {
    const isButtonDisabled = isDisabled || disabled

    return (
        <Pressable
            {...props}
            disabled={isButtonDisabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: isButtonDisabled }}
            style={({ pressed }) => [
                styles.container,
                isButtonDisabled && styles.disabled,
                pressed && !isButtonDisabled && styles.pressed,
                style,
            ]}
        >
            <Text style={[styles.text, textStyle]}>
                {title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: getHeight(54),
        paddingHorizontal: getWidth(20),
        borderRadius: radius.button,
        backgroundColor: colors.primaryBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.white,
        fontSize: getHeight(16),
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
})
