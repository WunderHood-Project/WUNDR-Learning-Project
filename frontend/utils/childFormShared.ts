import React from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>


export const buildChildHandleChange = <T extends Record<string, string | number | boolean | null>>(
    setChild: SetState<T>,
    setServerError?: SetState<string | null>
) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget as HTMLInputElement
    const { type, name, value, checked } = target

    if (!name) return

    setChild(prev => {
        const prevVal = prev[name]
        let nextVal: string | number | boolean | null

        if (type === 'checked' || typeof prevVal === 'boolean') {
            nextVal = checked
        } else if (typeof prevVal === 'number' || prevVal === null) {
            nextVal = value === "" ? null : Number(value)
        } else {
            nextVal = value
        }

        setServerError?.(null)
        return { ...prev, [name]: nextVal } as T
    })
}

export const buildAddEC = <RowT>(
    blankEC: () => RowT,
    keySeqRef: React.RefObject<number>,
    setEcs: SetState<RowT[]>,
    setRowKeys: SetState<string[]>,
    setEcErrors?: SetState<Partial<Record<string, string>>[]>
) => () => {
    setEcs(prev => (prev.length < 3) ? [...prev, blankEC()] : prev)
    setRowKeys(prev => (prev.length < 3 ? [...prev, String(keySeqRef.current++)] : prev))
    if (setEcErrors) {
        setEcErrors(prev => (prev.length < 3 ? [...prev, {}] : prev))
    }
}
