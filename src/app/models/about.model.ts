export interface AboutAvailability {
  available: boolean;
  labelKey: string;
}

export interface About {
  firstName: string;
  lastName: string;
  roleKey: string;
  taglineKey: string;
  bioKeys: string[];
  availability: AboutAvailability;
  locationKey: string;
}
