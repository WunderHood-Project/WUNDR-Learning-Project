import { FAQ } from "../../data/faq"
import AccordionItems from "./AccordionItems"

export default function Accordion() {
    const data = FAQ

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
