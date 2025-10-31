import { EmergencyContact } from "./emergencyContact";
import { User } from "./user";

export type Child = {
    id: string;
    firstName: string;
    lastName: string;
    preferredName?: string | null
    homeschool: boolean
    // homeschoolProgram?: string | null
    grade?: number | null
    birthday: string;
    allergiesMedical: string
    notes?: string | null
    photoConsent: boolean
    waiver: boolean
    parents: User[]
    emergencyContacts?: EmergencyContact[]
    updatedAt?: string
}

type ServerManaged = "id" | "parents"
type ChildMutable = Omit<Child, ServerManaged>

export type CreateChildForm = ChildMutable
export type UpdateChildForm = Partial<Omit<ChildMutable, 'waiver'>>
export type ChildErrorsForm = Partial<Record<keyof ChildMutable, string>>

export type CreateChildResponse = {
    child: Child
    parent: User
    emergencyContacts: EmergencyContact[];
    message: string;
}
