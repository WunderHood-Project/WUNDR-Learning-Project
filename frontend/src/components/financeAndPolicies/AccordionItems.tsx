import React, { useState, useRef } from "react"

type Props = {
    item: { title: string; content: string; } | { title: string; content: { text: string; link: string; label: string; }; }
}

const AccordionItems: React.FC<Props> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false)
    const contentRef = useRef<HTMLDivElement | null>(null)

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="border border-gray-200 rounded-xl mb-4 shadow-sm bg-white">
            {/* Header */}
            <div
                className="flex justify-between items-center cursor-pointer px-4 py-3 
                       hover:bg-gray-50 transition-colors rounded-xl"
                onClick={toggleAccordion}
            >
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>

                <span className="text-wonderleaf text-2xl leading-none select-none">
                    {isOpen ? '−' : '+'}
                </span>
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                style={{
                    maxHeight: isOpen
                        ? contentRef.current?.scrollHeight + "px"
                        : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                }}
            >
                <div className="px-4 pb-4 pt-1 text-gray-700 leading-relaxed">
                    <p>
                        {
                            typeof item.content === "string" ?
                                item.content :
                                (
                                    <>
                                        {item.content.text}
                                        {item.content.link && (
                                            <a
                                                href={item.content.link}
                                                target=""
                                                rel="noopener noreferrer"
                                                className="text-wonderleaf font-semibold underline hover:text-wonderleaf/80 transition"
                                            >
                                                {item.content.label}
                                            </a>
                                        )
                                        }
                                    </>
                                )
                        }
                    </p>
                </div>
            </div>
        </div>
    )

}

export default AccordionItems;