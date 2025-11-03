export type Payment = {
    id: string
    email: string
    donationType: "Donation" | "Sponsorship"
    amount: number
    sessionId: string
}

type serverManaged = "id" | "sessionId"
type PaymentMutable = Omit<Payment, serverManaged>

export type CreatePaymentPayload = PaymentMutable
export type PaymentFormErrors = Partial<Record<keyof PaymentMutable, string>>