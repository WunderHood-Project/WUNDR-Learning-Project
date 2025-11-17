export type TaxReturn= {
    id: string
    donationId: string
    acknowledgementRequested: boolean
    firstName: string
    lastName: string
    phoneNumber: string | null | undefined
    address: string
    address2?: string
    city: string
    state: string
    zipCode: string
    email: string
    requestSent: boolean
    general?: string
}

type serverManaged = "id"
type TaxReturnMutable = Omit<TaxReturn, serverManaged>

export type CreateTaxReturnPayload = TaxReturnMutable
export type TaxReturnErrors = Partial<Record<keyof TaxReturnMutable, string>>