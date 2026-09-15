import { home, journal, learn, profile, progress } from '@assets/index'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { getHeight } from '@src/libs/StyleHelper'
import { useUserState } from '@src/store/UseUserStore'
import colors from '@src/tokens/Colors'
import React, { lazy } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { Screens, TABS } from 'src/constants/Screens'
import { getTexts } from 'src/translations/TranslationHelper'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const Home = lazy(() => import('@src/screens/home'))
const Journal = lazy(() => import('@src/screens/journal'))
const Learn = lazy(() => import('@src/screens/learn'))
const Profile = lazy(() => import('@src/screens/profile'))
const Progress = lazy(() => import('@src/screens/progress'))





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
    const bottomPadding = insets.bottom > 0 ? insets.bottom : getHeight(10)

    const TabNames = [
        { tabIcon: home, name: TABS.HOME_TAB, screen: HomeNavigator, label: t.tabs.home },
        { tabIcon: progress, name: TABS.PROGRESS_TAB, screen: ProgressNavigator, label: t.tabs.progress },
        { tabIcon: journal, name: TABS.JOURNAL_TAB, screen: JournalNavigator, label: t.tabs.journal },
        { tabIcon: learn, name: TABS.LEARN_TAB, screen: LearnNavigator, label: t.tabs.learn },
        { tabIcon: profile, name: TABS.PROFILE_TAB, screen: ProfileNavigator, label: t.tabs.profile }
    ]

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: getHeight(58) + bottomPadding,
                        paddingBottom: bottomPadding,
                    },
                ],
                tabBarHideOnKeyboard: true,
                tabBarLabelPosition: 'below-icon',
                tabBarActiveTintColor: colors.primaryBlue,
                tabBarInactiveTintColor: colors.greyColor,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            {TabNames?.map((item) => {
                return (
                    <Tab.Screen
                        key={item.name}
                        options={{
                            title: item.label,
                            tabBarIcon: ({ focused }) => {
                                const Icon = item.tabIcon
                                const tintColor = focused ? colors.primaryBlue : colors.greyColor
                                return (
                                    <View style={styles.iconWrapper}>
                                        <Icon width={18} height={18} fill={tintColor} color={tintColor} />
                                    </View>
                                )
                            }
                        }}
                        name={item.name}
                        component={item.screen}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    safeAreaTop: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    tabBar: {
        borderTopWidth: getHeight(1),
        borderTopColor: colors.shadowColor,
        backgroundColor: colors.white,
        height: getHeight(65),
        paddingBottom: getHeight(8),
        paddingTop: getHeight(6),
        elevation: 4,
    },
    tabBarLabel: {
        fontSize: getHeight(11),
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.screenBackground,
    },
})

export default TabNavigator
