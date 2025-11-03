export type Payment = {
    id: string
    email: string
    donationType: "Donation" | "Sponsorship"
    amount: number
    sessionId: string
    userId: string
}

type serverManaged = "id" | "sessionId" | "userId"
type PaymentMutable = Omit<Payment, serverManaged>

export type CreatePaymentPayload = PaymentMutable
export type PaymentFormErrors = Partial<Record<keyof PaymentMutable, string>>