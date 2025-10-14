import { useModal } from "./modal";
import type React from "react";

interface OpenModalButtonProps {
    className?: string;
    modalComponent: React.ReactNode;
    buttonText: React.ReactNode;
    onButtonClick?: () => void;
    onModalClose?: () => void;
}

function OpenModalButton({
    className = '',
    modalComponent,
    buttonText,
    onButtonClick,
    onModalClose
}: OpenModalButtonProps) {
    const {setModalContent, setOnModalClose} = useModal()

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose)
        setModalContent(modalComponent)
        if (typeof onButtonClick === 'function') onButtonClick()
    }

    return <button className={`modal-button ${className}`} onClick={onClick}>{buttonText}</button>
}

export default OpenModalButton
