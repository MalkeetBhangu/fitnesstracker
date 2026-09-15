import { PROGRESS_SECTION_TYPES } from '@src/screens/progress/ProgressConstant'
import progressJson from '@src/mockJson/Progress.json'
import { ProgressSummary, Section } from "@src/types/ProgressTypes"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstans"

function fetchProgress(): Promise<ProgressSummary> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(progressJson as ProgressSummary), 400)
    })
}

export function transformProgressToSections(data?: ProgressSummary): Section[] {
    if (!data) return []
    const list: Section[] = []

    if (data.currentWeight) list.push({ id: 'weight', type: PROGRESS_SECTION_TYPES.WEIGHT, data: data.currentWeight })
    if (data.goal) list.push({ id: 'goal', type: PROGRESS_SECTION_TYPES.GOAL, data: data.goal })


    // Future cards can be appended here:
    // if (data.chart) list.push({ id: 'chart', type: 'chart', data: data.chart })
    // if (data.bmi) list.push({ id: 'bmi', type: 'bmi', data: data.bmi })
    // if (data.recentLogs?.items) list.push({ id: 'recentLogs', type: 'recentLogs', data: data.recentLogs.items })
    // if (data.walkthrough?.items) list.push({ id: 'walkthrough', type: 'walkthrough', data: data.walkthrough.items })

    return list
}

export function useProgress() {
    return useQuery({
        queryKey: [QUERY_KEYS.PROGRESS],
        queryFn: fetchProgress,
        select: transformProgressToSections,
        staleTime: 5 * 60 * 1000,
    })
}