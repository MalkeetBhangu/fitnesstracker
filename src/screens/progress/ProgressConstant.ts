import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { getTexts } from '@src/translations/TranslationHelper'

export enum PROGRESS_SECTION_TYPES {
    WEIGHT = 'weight',
    GOAL = 'goal',
    CHART = 'chart',
    BMI = 'bmi',
    RECENT_LOGS = 'recentLogs',
    WALKTHROUGH = 'walkthrough',
}

export const getMonthsList = (languageCode: string = DEFAULT_LANGUAGE_CODE): string[] => {
    const t = getTexts(languageCode)
    return Object.values(t.common?.months)
}
