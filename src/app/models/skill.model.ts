export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'other';

export interface Skill {
  name: string;
  category: SkillCategory;
  icon: string | null;
}
