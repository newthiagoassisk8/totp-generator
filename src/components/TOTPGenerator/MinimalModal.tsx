import { useEffect, useState } from "react"

type MinimalModalProps = {
    isShown: boolean
    text: string
    onClose: () => void
    duration?: number
}

export function MinimalModal({
    text,
    onClose,
    duration = 400
}: MinimalModalProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {

        setVisible(true)

        const hideTimer = setTimeout(() => {
            setVisible(false)
        }, duration)

        const closeTimer = setTimeout(() => {
            onClose()
        }, duration)

        return () => {
            clearTimeout(hideTimer)
            clearTimeout(closeTimer)
        }
    }, [duration, onClose])


    return (
        <div className={`modal ${visible ? "show" : "hide"}`}>
            {text}
        </div>
    )
}

