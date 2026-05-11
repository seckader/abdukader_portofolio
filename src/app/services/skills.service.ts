import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Skill, SkillCategory } from '../models/skill.model';

export type SkillsByCategory = Record<SkillCategory, Skill[]>;

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private readonly skills: Skill[] = [
    { name: 'HTML', category: 'frontend', icon: 'assets/icons/skills/html.svg' },
    { name: 'CSS', category: 'frontend', icon: 'assets/icons/skills/css.svg' },
    { name: 'JavaScript', category: 'frontend', icon: 'assets/icons/skills/javascript.svg' },
    { name: 'TypeScript', category: 'frontend', icon: 'assets/icons/skills/typescript.svg' },
    { name: 'Angular', category: 'frontend', icon: 'assets/icons/skills/angular.svg' },

    { name: 'Java', category: 'backend', icon: 'assets/icons/skills/java.svg' },
    { name: 'Node.js', category: 'backend', icon: 'assets/icons/skills/nodejs.svg' },
    { name: 'Express.js', category: 'backend', icon: 'assets/icons/skills/express.svg' },
    { name: 'Python', category: 'backend', icon: 'assets/icons/skills/python.svg' },
    { name: 'Spring Boot', category: 'backend', icon: 'assets/icons/skills/spring-boot.svg' },
    { name: 'Apache Kafka', category: 'backend', icon: 'assets/icons/skills/kafka.svg' },
    { name: 'REST APIs', category: 'backend', icon: 'assets/icons/skills/rest-api.svg' },

    { name: 'PostgreSQL', category: 'database', icon: 'assets/icons/skills/postgresql.svg' },
    { name: 'MySQL', category: 'database', icon: 'assets/icons/skills/mysql.svg' },
    { name: 'MongoDB', category: 'database', icon: 'assets/icons/skills/mongodb.svg' },

    { name: 'Docker', category: 'devops', icon: 'assets/icons/skills/docker.svg' },
    { name: 'Docker Compose', category: 'devops', icon: 'assets/icons/skills/docker.svg' },
    { name: 'Linux', category: 'devops', icon: 'assets/icons/skills/linux.svg' },
    { name: 'AWS', category: 'devops', icon: 'assets/icons/skills/aws.svg' },
    { name: 'CI/CD', category: 'devops', icon: 'assets/icons/skills/ci-cd.svg'},

    { name: 'Git', category: 'tools', icon: 'assets/icons/skills/git.svg' },
    { name: 'GitHub Actions', category: 'tools', icon: 'assets/icons/skills/ci-cd.svg' },
    { name: 'Jenkins', category: 'tools', icon: 'assets/icons/skills/jenkins.svg' },
    { name: 'Maven', category: 'tools', icon: 'assets/icons/skills/maven.svg' },
    { name: 'JUnit', category: 'tools', icon: null },
    { name: 'Mockito', category: 'tools', icon: null },

    { name: 'TCP/IP', category: 'network', icon: 'assets/icons/skills/tcp-ip.svg' },
    { name: 'skills.items.mobileNetwork', category: 'network', icon: 'assets/icons/skills/radio-mobile.svg' },
    { name: 'Routing', category: 'network', icon: 'assets/icons/skills/routing.svg' },
    { name: 'Switching', category: 'network', icon: 'assets/icons/skills/switch.svg' },
    { name: 'Monitoring', category: 'network', icon: 'assets/icons/skills/monitor.svg' },

    { name: 'skills.items.problemSolving', category: 'softSkills', icon: 'assets/icons/skills/problem-solving.svg' },
    { name: 'skills.items.analyticalThinking', category: 'softSkills', icon: 'assets/icons/skills/analytical-thinking.svg' },
    { name: 'skills.items.documentation', category: 'softSkills', icon: 'assets/icons/skills/documentation.svg' },
    { name: 'skills.items.continuousLearning', category: 'softSkills', icon: 'assets/icons/skills/learning.svg' },
  ];

  getSkills(): Observable<Skill[]> {
    return of([...this.skills]);
  }

  getSkillsByCategory(): Observable<SkillsByCategory> {
    const grouped: SkillsByCategory = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: [],
      network: [],
      softSkills: [],
    };

    this.skills.forEach(skill => grouped[skill.category].push(skill));

    return of(grouped);
  }
}
