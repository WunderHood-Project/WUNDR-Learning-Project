import { financeInfo } from "../../data/financeQuestions"
import AccordionItems from "./AccordionItems"

export default function Accordion() {
    const data = financeInfo

    return (
        <div>
            {
                data.map((item, index) => (
                    <div key={index}>
                        <AccordionItems item={item} />
                    </div>
                ))
            }
        </div>
    )
}