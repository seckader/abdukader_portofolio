export type ExperienceContractType = 'full_time' | 'fixed_term' | 'freelance' | 'internship';

export type ExperienceLocationType = 'remote' | 'on_site' | 'hybrid';

export interface Experience {
  companyName: string;
  companyUrl: string;
  roleKey: string;
  contractType: ExperienceContractType;
  startDateKey: string;
  endDateKey: string | null;
  locationType: ExperienceLocationType;
  locationKey: string;
  descriptionKeys: string[];
  technologies: string[];
  startDate: string;
}
