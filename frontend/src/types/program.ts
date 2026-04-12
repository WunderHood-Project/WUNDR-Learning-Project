export type ProgramStatus = "pending" | "approved" | "rejected";
export type ProgramVenue = "in_person" | "online" | "hybrid";
export type ProgramLabel = "wonderhood" | "partner";

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
  phases?: ProgramPhase[] | null;

  directorName?: string | null;
  directorTitle?: string | null;
  directorImage?: string | null;

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
