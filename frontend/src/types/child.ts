import { EmergencyContact } from "./emergencyContact";
import { User } from "./user";

export type Child = {
    id: string;
    firstName: string;
    lastName: string;
    preferredName?: string
    homeschool: boolean
    // homeschoolProgram?: string | null
    grade?: number ;
    birthday: string;
    allergiesMedical?: string
    notes?: string;
    photoConsent: boolean
    waiver: boolean
    parents: User[]
    emergencyContacts?: EmergencyContact[]
}

type ServerManaged = "id" | "parents"
type ChildMutable = Omit<Child, ServerManaged>

export type CreateChildForm = ChildMutable
export type UpdateChildForm = Partial<CreateChildForm>
export type ChildErrorsForm = Partial<Record<keyof ChildMutable, string>>

export type CreateChildResponse = {
    child: Child
    parent: User
    emergencyContacts: EmergencyContact[];
    message: string;
}
