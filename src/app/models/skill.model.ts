export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'tools'
  | 'network'
  | 'softSkills';

export interface Skill {
  name: string;
  category: SkillCategory;
  icon: string | null;
}
