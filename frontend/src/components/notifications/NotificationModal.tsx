import { useModal } from "@/app/context/modal";
import React, { useState } from "react";
import { makeApiRequest } from "../../../utils/api";
import { NotificationPayload } from "../../../utils/auth";

type ModalErrors = Partial<Record<
    "title" |
    "time" |
    "description", string
>>

type NotificationModalProps = {
    url: string
}

export function NotificationModal({ url }: NotificationModalProps) {
    const { closeModal } = useModal();
    const [isNotifying, setIsNotifying] = useState(false);
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [time] = useState<Date>(new Date())
    const [errors, setErrors] = useState<ModalErrors>({})
    // const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    const handleNotification = async () => {
        setIsNotifying(true)

        setErrors({})
        const newErrors: ModalErrors = {}

        // * Add Validations Here
        // Validate Subject
        if (title.length < 2) newErrors.title = "Must be greater than 2 characters"

        // Validate Content
        if (description.length < 2) newErrors.description = "Must be greater than 2 characters"

        if (description.length > 500) newErrors.description = "Must be less than 500 characters"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsNotifying(false);
            return;
        }

        const payload: NotificationPayload = {
            "title": title,
            "description": description,
            "time": time.toISOString()
        }

        try {
            await makeApiRequest(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            closeModal()
        } catch (e) {
            throw Error(`Unable to create blast notification: ${e}`)
        } finally {
            setIsNotifying(false)
        }
    }

    return (
        <div 
        className="rounded-lg p-6 w-full max-w-md mx-auto bg-white shadow-md"
        aria-busy={isNotifying}>
            <h1 className="text-xl font-bold text-center">Send a Notification to All Users</h1>
            <p className="text-sm text-center text-gray-600">
                All registered users will receive an email notification
            </p>

            {/* Title */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    name="title"
                    placeholder="Rock Climbing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wondergreen"
                />
                {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
            </div>

            {/* Content */}
            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                    name="description"
                    placeholder="Write message"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-wondergreen"
                ></textarea>
                {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
            </div>
            {/* Actions */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={handleNotification}
                    disabled={isNotifying}
                    className="border border-black bg-wondergreen hover:bg-wonderleaf rounded w-[100px] text-white py-2 font-medium transition-colors"
                >
                    Send
                </button>
                <button
                    onClick={closeModal}
                    className="border border-black bg-red-600 hover:bg-red-800 rounded w-[100px] text-white py-2 font-medium transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}