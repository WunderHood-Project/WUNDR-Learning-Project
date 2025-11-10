export type TaxReturn= {
    id: string
    acknowledgementRequested: boolean
    firstName: string
    lastName: string
    phoneNumber?: string
    address: string
    address2?: string
    city: string
    state: string
    zipCode: string
    email: string
}

type serverManaged = "id"
type TaxReturnMutable = Omit<TaxReturn, serverManaged>

export type CreateTaxReturnPayload = TaxReturnMutable
export type TaxReturnErrors = Partial<Record<keyof TaxReturnMutable, string>>