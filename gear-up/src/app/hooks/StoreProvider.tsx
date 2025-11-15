'use client'
import {ReactNode, useRef} from 'react'
import {Provider} from "react-redux";
import { store, AppStore } from '@/lib/Store'

export default function StoreProvider({
    children
}: {
    children: ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store()
    }

    return <Provider store={storeRef.current}>{children}</Provider>
}