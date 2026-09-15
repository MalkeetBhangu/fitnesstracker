import React, { useCallback, useEffect } from "react"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { enableFreeze } from "react-native-screens"
import { Screens, TABS } from "@src/constants/Screens"
import colors from "@src/tokens/Colors"
import TabNavigator from "./TabNavigator"
import { useUserState } from "@src/store/UseUserStore"
const { HOME } = Screens
enableFreeze(true)

const MainStack = createNativeStackNavigator()

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.screenBackground,
    },
}

const Navigation: React.FC = () => {
    const { userData } = useUserState()

    const handleNavigationReady = useCallback(() => { }, [])

    return (
        <NavigationContainer theme={navigationTheme} onReady={handleNavigationReady}>
            <MainStack.Navigator initialRouteName={TABS.BOTTOM_TABS} screenOptions={{ headerShown: false }}>
                <MainStack.Screen options={{ navigationBarHidden: true }} name={TABS.BOTTOM_TABS} component={TabNavigator} />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

