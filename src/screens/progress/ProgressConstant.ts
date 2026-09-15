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

export const getDaysList = (languageCode: string = DEFAULT_LANGUAGE_CODE): string[] => {
    const t = getTexts(languageCode)
    return Object.values(t.common?.days || {})
}

export const FALLBACK_THUMBNAILS: Record<string, string> = {
    wt_1: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    wt_2: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80',
}

