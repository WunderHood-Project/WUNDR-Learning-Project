export const VENUE_OPTIONS = ['Indoors', 'Outdoors', 'Online'] as const;
export type Venue = typeof VENUE_OPTIONS[number];

export type Opp = {
  id: string;
  title: string;
  venue: Venue[];
  duties: string[];
  skills: string[];
  time: string;
  requirements: string[];
  tags?: string[];
  minAge: number;
  bgCheckRequired: boolean;
  volunteerIds?: string[];
  createdAt?: string;
  updatedAt?: string | null;
};

export type OppCreate = Omit<Opp, 'id' | 'createdAt' | 'updatedAt'>;
export type OppUpdate = Partial<OppCreate>;
