export type TaxReturn= {
    id: string
    firstName: string
    lastName: string
    phone: string
    email: string
}

type serverManaged = "id"
type TaxReturnMutable = Omit<TaxReturn, serverManaged>

export type CreateTaxReturnPayload = TaxReturnMutable
export type TaxReturnErrors = Partial<Record<keyof TaxReturnMutable, string>>