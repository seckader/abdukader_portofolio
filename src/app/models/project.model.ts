export type ProjectCategory = 'web' | 'mobile' | 'api' | 'open-source' | 'other';

export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface ProjectPreviewImage {
  webp: string;
  jpg: string;
  altKey: string;
}

export interface Project {
  titleKey: string;
  shortDescriptionKey: string;
  longDescriptionKey: string;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  previewImage?: ProjectPreviewImage;
  featured: boolean;
  year: number;
  displayOrder: number;
}
