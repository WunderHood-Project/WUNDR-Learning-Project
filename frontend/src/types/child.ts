import { EmergencyContact } from "./emergencyContact";
import { User } from "./user";

export type Child = {
    id: string;
    firstName: string;
    lastName: string;
    preferredName?: string | null
    homeschool: boolean
    // homeschoolProgram?: string | null
    grade?: number | null;
    birthday: string;
    allergiesMedical?: string | null
    notes?: string | null;
    photoConsent: boolean
    waiver: boolean
    parents: User[]
    emergencyContacts?: EmergencyContact[]
}
