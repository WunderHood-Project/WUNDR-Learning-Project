export type fundraiserDinner = {
    adultQty: number,
    childQty: number,
    freeQty: number,
    familyQty: number,
    firstName: string,
    lastName: string,
    email: string,
    sessionId: string,
    userId: string
}

// Omit fields the server controls or derives
type serverManaged = "sessionId" | "userId"
type dinnerPaymentMutable = Omit<fundraiserDinner, serverManaged>

export type CreateDinnerPaymentPayload = dinnerPaymentMutable
export type DinnerPaymentFormErrors = Partial<Record<keyof dinnerPaymentMutable, string>>

export type DinnerTicketTierKey = "adultQty" | "childQty" | "freeQty" | "familyQty"

export type DinnerTicketTier = {
    key: DinnerTicketTierKey
    label: string
    price: number
    description: string
}

export const DINNER_TICKET_TIERS: DinnerTicketTier[] = [
    { key: "adultQty", label: "Adult Ticket", price: 35, description: "For guests ages 13 and older." },
    { key: "childQty", label: "Child Ticket", price: 15, description: "For children ages 5–12." },
    { key: "freeQty", label: "Children Ages 4 and Under", price: 0, description: "Please include them in your reservation so we can prepare enough seating and food." },
    { key: "familyQty", label: "Family Ticket", price: 90, description: "Includes admission for up to two adults and their dependent children under age 18 living in the same household." },
]
