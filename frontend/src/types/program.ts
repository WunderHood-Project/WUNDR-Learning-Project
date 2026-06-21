export type ProgramStatus = "pending" | "approved" | "rejected";
export type ProgramVenue = "in_person" | "online" | "hybrid";
export type ProgramLabel = "wonderhood" | "partner";
export type ProgramRegistrationType = "wonderhood" | "external";

export type ProgramPhase = {
  season: string;
  title: string;
};

export type EnrichmentProgram = {
  id?: string;
  activityId?: string;

  name: string;
  description: string;
  ageMin: number;
  ageMax: number;

  startDate: string;
  endDate: string;

  sessionSchedule?: string | null;
  image?: string | null;

  outcomes: string[];
  label: ProgramLabel;
  registrationType: ProgramRegistrationType;
  registrationUrl?: string | null;
  phases?: ProgramPhase[] | null;

  directorName?: string | null;
  directorTitle?: string | null;
  directorImage?: string | null;
  directorBio?: string | null;

  participants: number;
  limit?: number | null;

  venue: ProgramVenue;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  zipCode?: string | null;

  status?: ProgramStatus;
  childIds?: string[];
  userIds?: string[];

  createdAt?: string;
  updatedAt?: string;
};

type ServerManaged = "id" | "participants" | "childIds" | "userIds" | "status";
type ProgramMutable = Omit<EnrichmentProgram, ServerManaged>;
export type CreateProgramPayload = ProgramMutable;
export type UpdateProgramPayload = Partial<ProgramMutable>;
export type ProgramFormErrors = Partial<Record<string, string>>;

export type ProgramThreadStatus = "open" | "closed";

export type ProgramMessage = {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  readByIds: string[];
  createdAt: string;
};

export type ProgramThread = {
  id: string;
  programId: string;
  program?: {
    id: string;
    name: string;
  };
  userId: string;
  subject: string;
  status: ProgramThreadStatus;
  isPrivate: boolean;
  messages: ProgramMessage[];
  createdAt: string;
  updatedAt?: string;
};
