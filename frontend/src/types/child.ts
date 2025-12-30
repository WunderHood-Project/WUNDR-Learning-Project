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
    allergiesMedical?: string | null | undefined
    notes?: string | null
    photoConsent: boolean
    photoConsentVer?: string | null;
    photoConsentAt?: string | null;
    waiver: boolean
    waiverVersion?: string | null;
    waiverSignedAt?: string | null;
    waiverSignedByName?: string | null;

    parents: User[]
    emergencyContacts?: EmergencyContact[]

    createdAt?: string;
    updatedAt?: string
}

type ServerManaged = "id" | "parents" | "createdAt" | "updatedAt" | "waiverVersion" | "waiverSignedAt" | "photoConsentVer" | "photoConsentAt";
type ChildMutable = Omit<Child, ServerManaged>

export type CreateChildForm = ChildMutable & {
    waiverSectionsAck?: boolean[]
}
export type UpdateChildForm = Partial<Omit<ChildMutable, 'waiver'>>
// export type ChildErrorsForm = Partial<Record<keyof ChildMutable, string>>
export type ChildErrorsForm = Partial<Record<keyof CreateChildForm, string>>

export type CreateChildResponse = {
    child: Child
    parent: User
    emergencyContacts: EmergencyContact[];
    message: string;
}
