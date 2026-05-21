export interface FHIRPractitioner {
  resourceType: 'Practitioner';
  id?: string;
  name?: {
    use?: string;
    family?: string;
    given?: string[];
  }[];
  telecom?: {
    system?: string;
    value?: string;
    use?: string;
  }[];
  gender?: string;
  birthDate?: string;
  specialty?: {
    coding?: {
      code?: string;
      display?: string;
    }[];
  }[];
}
