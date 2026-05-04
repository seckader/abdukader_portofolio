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
      titleKey: 'projects.items.portfolio.title',
      shortDescriptionKey: 'projects.items.portfolio.shortDescription',
      longDescriptionKey: 'projects.items.portfolio.longDescription',
      category: 'web',
      status: 'in-progress',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'GSAP'],
      githubUrl: 'https://github.com/',
      liveUrl: 'https://example.com',
      previewImage: {
        webp: 'assets/images/projects/portfolio-preview.webp',
        jpg: 'assets/images/projects/portfolio-preview.jpg',
        altKey: 'projects.items.portfolio.imageAlt',
      },
      featured: true,
      year: 2026,
      displayOrder: 1,
    },
    {
      titleKey: 'projects.items.dashboard.title',
      shortDescriptionKey: 'projects.items.dashboard.shortDescription',
      longDescriptionKey: 'projects.items.dashboard.longDescription',
      category: 'web',
      status: 'completed',
      technologies: ['Angular', 'Node.js', 'PostgreSQL', 'REST API'],
      githubUrl: 'https://github.com/',
      liveUrl: 'https://example.com',
      previewImage: {
        webp: 'assets/images/projects/dashboard-preview.webp',
        jpg: 'assets/images/projects/dashboard-preview.jpg',
        altKey: 'projects.items.dashboard.imageAlt',
      },
      featured: true,
      year: 2025,
      displayOrder: 2,
    },
    {
      titleKey: 'projects.items.apiHub.title',
      shortDescriptionKey: 'projects.items.apiHub.shortDescription',
      longDescriptionKey: 'projects.items.apiHub.longDescription',
      category: 'api',
      status: 'completed',
      technologies: ['Node.js', 'Express', 'JWT', 'Docker'],
      githubUrl: 'https://github.com/',
      liveUrl: 'https://example.com',
      previewImage: {
        webp: 'assets/images/projects/api-preview.webp',
        jpg: 'assets/images/projects/api-preview.jpg',
        altKey: 'projects.items.apiHub.imageAlt',
      },
      featured: true,
      year: 2025,
      displayOrder: 3,
    },
    {
      titleKey: 'projects.items.componentKit.title',
      shortDescriptionKey: 'projects.items.componentKit.shortDescription',
      longDescriptionKey: 'projects.items.componentKit.longDescription',
      category: 'open-source',
      status: 'in-progress',
      technologies: ['TypeScript', 'SCSS', 'Storybook'],
      githubUrl: 'https://github.com/',
      featured: false,
      year: 2025,
      displayOrder: 4,
    },
    {
      titleKey: 'projects.items.mobileCompanion.title',
      shortDescriptionKey: 'projects.items.mobileCompanion.shortDescription',
      longDescriptionKey: 'projects.items.mobileCompanion.longDescription',
      category: 'mobile',
      status: 'archived',
      technologies: ['Ionic', 'Angular', 'Capacitor'],
      githubUrl: 'https://github.com/',
      featured: false,
      year: 2024,
      displayOrder: 5,
    },
    {
      titleKey: 'projects.items.automation.title',
      shortDescriptionKey: 'projects.items.automation.shortDescription',
      longDescriptionKey: 'projects.items.automation.longDescription',
      category: 'other',
      status: 'completed',
      technologies: ['Node.js', 'CLI', 'GitHub Actions'],
      githubUrl: 'https://github.com/',
      liveUrl: 'https://example.com',
      featured: false,
      year: 2024,
      displayOrder: 6,
    },
    {
      titleKey: 'projects.items.learningApi.title',
      shortDescriptionKey: 'projects.items.learningApi.shortDescription',
      longDescriptionKey: 'projects.items.learningApi.longDescription',
      category: 'api',
      status: 'completed',
      technologies: ['Spring Boot', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com/',
      featured: false,
      year: 2023,
      displayOrder: 7,
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
