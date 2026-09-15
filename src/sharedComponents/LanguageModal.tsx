import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'

export interface LanguageModalProps {
    visible: boolean
    onClose: () => void
}

const LANGUAGES = [
    { code: 'en', key: 'english' as const, flag: '🇬🇧' },
    { code: 'de', key: 'german' as const, flag: '🇩🇪' },
]

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE }, setUserData } = useUserState(['languageCode'])
    const t = getTexts(languageCode)

    const handleSelectLanguage = (code: string) => {
        setUserData({ languageCode: code })
        onClose()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    <TextView text={t.languageModal?.title} style={styles.title} />

                    <View style={styles.optionsList}>
                        {LANGUAGES.map((lang) => {
                            const isSelected = languageCode === lang.code
                            const label = t.languageModal?.[lang.key]

                            return (
                                <Pressable
                                    key={lang.code}
                                    onPress={() => handleSelectLanguage(lang.code)}
                                    style={({ pressed }) => [
                                        styles.optionItem,
                                        isSelected && styles.optionItemSelected,
                                        pressed && styles.optionItemPressed,
                                    ]}
                                >
                                    <View style={styles.optionLeft}>
                                        <TextView text={lang.flag} style={styles.flagText} />
                                        <TextView
                                            text={label}
                                            style={[
                                                styles.optionText,
                                                isSelected && styles.optionTextSelected,
                                            ]}
                                        />
                                    </View>

                                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </Pressable>
                            )
                        })}
                    </View>

                    <Pressable
                        onPress={onClose}
                        style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
                    >
                        <TextView text={t.languageModal?.cancel} style={styles.cancelText} />
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default LanguageModal

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: getWidth(24),
    },
    modalContent: {
        width: '100%',
        maxWidth: getWidth(360),
        backgroundColor: colors.white,
        borderRadius: getWidth(20),
        paddingHorizontal: getWidth(20),
        paddingVertical: getHeight(20),
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.black,
        textAlign: 'center',
        marginBottom: getHeight(16),
    },
    optionsList: {
        gap: getHeight(10),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.subCardBg,
        borderRadius: getWidth(14),
        paddingHorizontal: getWidth(16),
        paddingVertical: getHeight(14),
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    optionItemSelected: {
        backgroundColor: colors.tabHighlight,
        borderColor: colors.primaryBlue,
    },
    optionItemPressed: {
        opacity: 0.8,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagText: {
        fontSize: getHeight(20),
        marginRight: getWidth(12),
    },
    optionText: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.darkGrey,
    },
    optionTextSelected: {
        color: colors.primaryBlueDark,
        fontWeight: '700',
    },
    radioOuter: {
        width: getWidth(20),
        height: getWidth(20),
        borderRadius: getWidth(10),
        borderWidth: 2,
        borderColor: colors.borderGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primaryBlue,
    },
    radioInner: {
        width: getWidth(10),
        height: getWidth(10),
        borderRadius: getWidth(5),
        backgroundColor: colors.primaryBlue,
    },
    cancelButton: {
        marginTop: getHeight(16),
        paddingVertical: getHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonPressed: {
        opacity: 0.7,
    },
    cancelText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textSecondary,
    },
})
