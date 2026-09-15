import * as ReactNavigation from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Screens, TABS } from '@src/constants/Screens'

const { HOME } = Screens

export type ParamsList = {
    [TABS.HOME_TAB]: undefined
    [TABS.JOURNAL_TAB]: undefined
    [TABS.PROGRESS_TAB]: undefined
    [TABS.LEARN_TAB]: undefined
    [TABS.PROFILE_TAB]: undefined
    [HOME]: undefined
}

export default function useNavigation() {
    return ReactNavigation.useNavigation<StackNavigationProp<ParamsList>>()
}
