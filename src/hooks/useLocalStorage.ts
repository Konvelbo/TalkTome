import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch {
            // storage full or unavailable
        }
    }, [key, storedValue])

    const setValue = (value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
    }

    return [storedValue, setValue] as const
}
