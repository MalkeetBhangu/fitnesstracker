import { DEFAULT_LANGUAGE_CODE } from '@src/constants/Constants'
import { User } from '@src/types/UserTypes'
import { localStorage, STORAGE } from '@src/localStorage/Store'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'



interface UserState {
    userData: Partial<User>
    setUserData: (data: Partial<User>) => void
    resetUserData: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userData: {
                languageCode: DEFAULT_LANGUAGE_CODE
            } as Partial<User>,
            setUserData: (data: Partial<User>) =>
                set((state) => ({
                    userData: { ...state.userData, ...data }
                })),
            resetUserData: () =>
                set((state) => ({
                    userData: {
                        isLoggedIn: false
                    } as Partial<User>
                }))
        }),
        localStorage(STORAGE.USER)
    )
)

export const useUserState = <T extends keyof User>(selectors?: T[]) => {
    const userState = useUserStore((state) => state.userData)

    const userData = selectors
        ? selectors.reduce((acc, key) => {
            acc[key] = userState[key]
            return acc
        }, {} as Partial<User>)
        : userState

    const setUserData = useUserStore((state) => state.setUserData)
    const resetUserData = useUserStore((state) => state.resetUserData)

    return {
        userData,
        setUserData,
        resetUserData
    }
}
