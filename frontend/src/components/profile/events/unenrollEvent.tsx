import { Child } from "@/types/child"
import React, { useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { determineEnv } from "../../../../utils/api"

let WONDERHOOD_URL = determineEnv()

type Props = {
    enrolledChildren: Child[]
    eventID: string | undefined
    onAfterUnenroll?: () => void
}

const UnenrollEvent: React.FC<Props> = ({ enrolledChildren, eventID, onAfterUnenroll }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set)
    const [serverError, setServerError] = useState<string | null>(null)

    const toggleChild = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleUnenroll = async (e: React.FormEvent) => {
        e.preventDefault()
        const childIDs = Array.from(selected)

        try {
            await makeApiRequest(`${WONDERHOOD_URL}/event/${eventID}/unenroll`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: { childIDs }
            })
            setSelected(new Set())
            onAfterUnenroll?.()
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to unenroll child(ren)")
        }
    }

    return (
        <form onSubmit={handleUnenroll} className="space-y-4 px-10">
            <fieldset className="space-y-2">
                {enrolledChildren?.map(child => {
                    const childID = `child-${child.id}`
                    const isChecked = selected.has(child.id)

                    return (
                        <div key={child.id} className="flex flex-row gap-2">
                            <input
                                id={childID}
                                type="checkbox"
                                name="children"
                                value={child.id}
                                checked={isChecked}
                                onChange={() => toggleChild(child.id)}
                                className="h-4 w-4"
                            />
                            <label className="cursor-pointer">{child.firstName} {child.lastName}</label>
                        </div>
                    )
                })}
            </fieldset>
            <div className="flex flex-row gap-12">
                <button type="submit">Unenroll</button>
            </div>
            {serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}
        </form>
    )
}

export default UnenrollEvent
