export type WaiverAcknowledgePayload = {
  childId: string;
  version: string;
  legalName: string;
  signedAt?: string; 
};

export type PhotoConsentPayload = {
  childId: string;
  allow: boolean;    
  version: string;
  legalName: string;
  signedAt?: string;
};
