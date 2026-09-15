import { home, journal, learn, profile, progress } from '@assets/index'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { Screens, TABS } from '@src/constants/Screens'
import { getHeight, getWidth } from '@src/libs/StyleHelper'
import Home from '@src/screens/home'
import Journal from '@src/screens/journal'
import Learn from '@src/screens/learn'
import Profile from '@src/screens/profile'
import Progress from '@src/screens/progress'
import TextView from '@src/sharedComponents/TextView'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import { getTexts } from '@src/translations/TranslationHelper'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.HOME} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.HOME} component={Home} />
        </Stack.Navigator>
    )
}

const ProgressNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.PROGRESS} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.PROGRESS} component={Progress} />
        </Stack.Navigator>
    )
}

const LearnNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.LEARN} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.LEARN} component={Learn} />
        </Stack.Navigator>
    )
}

const JournalNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.JOURNAL} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.JOURNAL} component={Journal} />
        </Stack.Navigator>
    )
}

const ProfileNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.PROFILE} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.PROFILE} component={Profile} />
        </Stack.Navigator>
    )
}

const TabNavigator = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const insets = useSafeAreaInsets()
    const bottomMargin = insets.bottom > 0 ? insets.bottom : getHeight(14)
    const tabBarHeight = getHeight(68)
    const tabCircleSize = getHeight(60)

    const TabNames = [
        { tabIcon: home, name: TABS.HOME_TAB, screen: HomeNavigator, label: t.tabs.home },
        { tabIcon: progress, name: TABS.PROGRESS_TAB, screen: ProgressNavigator, label: t.tabs.progress },
        { tabIcon: learn, name: TABS.LEARN_TAB, screen: LearnNavigator, label: t.tabs.learn },
        { tabIcon: journal, name: TABS.JOURNAL_TAB, screen: JournalNavigator, label: t.tabs.journal },
        { tabIcon: profile, name: TABS.PROFILE_TAB, screen: ProfileNavigator, label: t.tabs.profile },
    ]

    return (
        <Tab.Navigator
            initialRouteName={TABS.PROGRESS_TAB}
            tabBar={({ state, navigation }) => (
                <View
                    style={[
                        styles.tabBarContainer,
                        {
                            bottom: bottomMargin,
                            height: tabBarHeight,
                            borderRadius: tabBarHeight / 2,
                        },
                    ]}
                >
                    {state.routes.map((route, index) => {
                        const isFocused = state.index === index
                        const item = TabNames[index]
                        if (!item) return null

                        const Icon = item.tabIcon
                        const tintColor = isFocused ? colors.primaryBlue : colors.darkGrey

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            })

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name)
                            }
                        }

                        return (
                            <Pressable
                                key={route.key}
                                accessibilityState={isFocused ? { selected: true } : {}}
                                onPress={onPress}
                                style={styles.tabButton}
                            >
                                <View
                                    style={[
                                        styles.tabHighlight,
                                        {
                                            width: tabCircleSize,
                                            height: tabCircleSize,
                                            borderRadius: tabCircleSize / 2,
                                        },
                                        isFocused && styles.activeTabHighlight,
                                    ]}
                                >
                                    <Icon width={getHeight(21)} height={getHeight(21)} fill={tintColor} color={tintColor} />
                                    <TextView
                                        numberOfLines={1}
                                        text={item.label}
                                        style={[
                                            styles.tabLabel,
                                            {
                                                color: tintColor,
                                            },
                                        ]}
                                    />
                                </View>
                            </Pressable>
                        )
                    })}
                </View>
            )}
            screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
        >
            {TabNames.map((item) => <Tab.Screen key={item.name} name={item.name} component={item.screen} />)}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        left: getWidth(16),
        right: getWidth(16),
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'space-around',
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        paddingHorizontal: getWidth(6),
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabHighlight: {
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabHighlight: {
        backgroundColor: colors.tabHighlight,
    },
    tabLabel: {
        fontSize: getHeight(11),
        marginTop: getHeight(2),
        textAlign: 'center',
    },
})

export default TabNavigator
