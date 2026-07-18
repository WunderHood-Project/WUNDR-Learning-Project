export type fundraiserDinner = {
    amount: string,
    email: string,
    sessionId: string,
    userId: string
}

// Omit fields the server controls or derives; amount is fixed server-side
type serverManaged = "sessionId" | "userId" | "amount"
type dinnerPaymentMutable = Omit<fundraiserDinner, serverManaged>

export type CreateDinnerPaymentPayload = dinnerPaymentMutable
export type DinnerPaymentFormErrors = Partial<Record<keyof dinnerPaymentMutable, string>>