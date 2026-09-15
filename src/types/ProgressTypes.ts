import { PROGRESS_SECTION_TYPES } from '@src/screens/progress/ProgressConstant'

export interface WeightInfo {
    value: number
    unit: string
    delta: number
    trend: 'up' | 'down' | 'same'
    lastLoggedAt: string
}

export interface GoalInfo {
    target: number
    unit: string
    targetDate: string
    pace: {
        value: number
        unit: string
        label: string
    }
}

export interface ChartSeriesItem {
    date: string
    avgWeight: number
}

export interface ChartHighlight {
    range: string
    date: string
    label: string
    avgWeight: number
}

export interface ChartInfo {
    ranges: string[]
    defaultRange: string
    seriesByRange: {
        W: ChartSeriesItem[]
        M: ChartSeriesItem[]
        '6M': ChartSeriesItem[]
        Y: ChartSeriesItem[]
        [key: string]: ChartSeriesItem[]
    }
    highlight: ChartHighlight
}

export interface BmiInfo {
    value: number
    status: string
    heightCm: number
    scale: {
        min: number
        max: number
        bands: number[]
    }
}

export interface RecentLogItem {
    id: string
    weight: number
    unit: string
    waistCm: number | null
    delta: number
    trend: 'up' | 'down' | 'same'
    loggedAt: string
}

export interface WalkthroughItem {
    id: string
    tag: string
    title: string
    videoUrl: string
    thumbnailUrl: string
    durationSeconds: number
}

export interface ProgressSummary {
    currentWeight: WeightInfo
    goal: GoalInfo
    chart: ChartInfo
    bmi: BmiInfo
    recentLogs: {
        items: RecentLogItem[]
        hasMore: boolean
        nextCursor: string
    }
    walkthrough: {
        items: WalkthroughItem[]
        hasMore: boolean
        nextCursor: string
    }
}

export type ProgressSection =
    | { id: string; type: PROGRESS_SECTION_TYPES.WEIGHT; data: WeightInfo }
    | { id: string; type: PROGRESS_SECTION_TYPES.GOAL; data: GoalInfo }
    | { id: string; type: PROGRESS_SECTION_TYPES.CHART; data: ChartInfo }
    | { id: string; type: PROGRESS_SECTION_TYPES.BMI; data: BmiInfo }
    | { id: string; type: PROGRESS_SECTION_TYPES.RECENT_LOGS; data: RecentLogItem[] }
    | { id: string; type: PROGRESS_SECTION_TYPES.WALKTHROUGH; data: WalkthroughItem[] }

export type Section = ProgressSection


