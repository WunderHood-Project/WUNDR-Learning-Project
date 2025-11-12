export type PartnerType = "venue" | "program" | "resource" | "education";

export interface PartnerApplication {
    orgName: string;
    contactName: string;
    email: string;
    phone?: string;
    partnerType: PartnerType;
    website?: string;
    city?: string;
    state?: string;
    howCanYouHelp?: string;
    preferredDates?: string;
    budgetOrInKind?: string;
    notes?: string;
}
