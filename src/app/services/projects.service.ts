import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project, ProjectCategory } from '../models/project.model';

export type ProjectsByCategory = Record<ProjectCategory, Project[]>;

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly projects: Project[] = [
    {
      titleKey: 'projects.items.kafkaEventPlatform.title',
      shortDescriptionKey: 'projects.items.kafkaEventPlatform.shortDescription',
      longDescriptionKey: 'projects.items.kafkaEventPlatform.longDescription',
      category: 'api',
      status: 'completed',
      technologies: [
        'Java',
        'Spring Boot',
        'Apache Kafka',
        'Docker',
        'Docker Compose',
        'REST APIs',
        'Maven',
        'GitHub Actions',
        'JUnit',
        'Mockito',
      ],
      githubUrl: 'https://github.com/seckader/kafka-event-platform',
      previewImage: {
        webp: 'assets/images/projects/project-kafka-event-platform.webp',
        jpg: 'assets/images/projects/project-kafka-event-platform.jpg',
        altKey: 'projects.items.kafkaEventPlatform.imageAlt',
      },
      featured: true,
      year: 2026,
      displayOrder: 1,
    },
  ];

  getProjects(): Observable<Project[]> {
    return of(this.sortProjects(this.projects));
  }

  getFeaturedProjects(): Observable<Project[]> {
    return of(this.sortProjects(this.projects.filter(project => project.featured)).slice(0, 4));
  }

  getProjectsByCategory(): Observable<ProjectsByCategory> {
    const grouped: ProjectsByCategory = {
      web: [],
      mobile: [],
      api: [],
      'open-source': [],
      other: [],
    };

    this.sortProjects(this.projects).forEach(project => grouped[project.category].push(project));

    return of(grouped);
  }

  private sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return b.year - a.year;
    });
  }
}
