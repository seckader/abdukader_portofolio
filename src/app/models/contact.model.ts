export interface ContactSocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'twitter';
}

export interface ContactAvailability {
  available: boolean;
  messageKey: string;
}

export interface Contact {
  email: string;
  socialLinks: ContactSocialLink[];
  availability: ContactAvailability;
  missionKeys: string[];
}
