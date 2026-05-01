import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Skill, SkillCategory } from '../models/skill.model';

export type SkillsByCategory = Record<SkillCategory, Skill[]>;

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private readonly skills: Skill[] = [
    { name: 'Angular', category: 'frontend', icon: 'assets/icons/skills/angular.svg' },
    { name: 'TypeScript', category: 'frontend', icon: 'assets/icons/skills/typescript.svg' },
    { name: 'SCSS', category: 'frontend', icon: 'assets/icons/skills/scss.svg' },
    { name: 'RxJS', category: 'frontend', icon: 'assets/icons/skills/rxjs.svg' },
    { name: 'Node.js', category: 'backend', icon: 'assets/icons/skills/nodejs.svg' },
    { name: 'Express', category: 'backend', icon: 'assets/icons/skills/express.svg' },
    { name: 'Spring Boot', category: 'backend', icon: 'assets/icons/skills/spring-boot.svg' },
    { name: 'PostgreSQL', category: 'backend', icon: 'assets/icons/skills/postgresql.svg' },
    { name: 'Docker', category: 'devops', icon: 'assets/icons/skills/docker.svg' },
    { name: 'GitHub Actions', category: 'devops', icon: 'assets/icons/skills/github-actions.svg' },
    { name: 'Linux', category: 'devops', icon: 'assets/icons/skills/linux.svg' },
    { name: 'REST APIs', category: 'other', icon: null },
  ];

  getSkills(): Observable<Skill[]> {
    return of([...this.skills]);
  }

  getSkillsByCategory(): Observable<SkillsByCategory> {
    const grouped: SkillsByCategory = {
      frontend: [],
      backend: [],
      devops: [],
      other: [],
    };

    this.skills.forEach(skill => grouped[skill.category].push(skill));

    return of(grouped);
  }
}
