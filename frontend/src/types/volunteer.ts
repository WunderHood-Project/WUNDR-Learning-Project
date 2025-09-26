
export type AvailabilityDay = 'Weekdays' | 'Weekends';
export type AppStatus = 'New' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';

export type VolunteerCreate = {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  cities: string[];
  daysAvail: AvailabilityDay[];
  timesAvail: string[];
  skills: string[];
  bio?: string;
  photoConsent: boolean;
  backgroundCheckConsent: boolean;
};

// Model for reading requests from API
export type VolunteerApp = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  photoConsent?: boolean;
  backgroundCheckConsent?: boolean;
  cities?: string[];
  daysAvail?: AvailabilityDay[];
  timesAvail?: string[];
  skills?: string[];
  status?: AppStatus;
  volunteerOpportunityIDs?: string[];
  generalAppliedAt?: string | null;
  createdAt?: string;
};


