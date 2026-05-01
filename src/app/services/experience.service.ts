import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Experience } from '../models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly experiences: Experience[] = [
    {
      companyName: 'Placeholder Studio',
      companyUrl: 'https://example.com',
      roleKey: 'experience.items.placeholderStudio.role',
      contractType: 'freelance',
      startDateKey: 'experience.items.placeholderStudio.startDate',
      endDateKey: null,
      locationType: 'remote',
      locationKey: 'experience.items.placeholderStudio.location',
      descriptionKeys: [
        'experience.items.placeholderStudio.description.0',
        'experience.items.placeholderStudio.description.1',
        'experience.items.placeholderStudio.description.2',
      ],
      technologies: ['Angular', 'TypeScript', 'Node.js', 'REST API'],
      startDate: '2025-01-01',
    },
    {
      companyName: 'Placeholder Labs',
      companyUrl: 'https://example.com',
      roleKey: 'experience.items.placeholderLabs.role',
      contractType: 'full_time',
      startDateKey: 'experience.items.placeholderLabs.startDate',
      endDateKey: 'experience.items.placeholderLabs.endDate',
      locationType: 'hybrid',
      locationKey: 'experience.items.placeholderLabs.location',
      descriptionKeys: [
        'experience.items.placeholderLabs.description.0',
        'experience.items.placeholderLabs.description.1',
        'experience.items.placeholderLabs.description.2',
      ],
      technologies: ['Angular', 'Java', 'Spring Boot', 'PostgreSQL'],
      startDate: '2023-06-01',
    },
    {
      companyName: 'Placeholder Digital',
      companyUrl: 'https://example.com',
      roleKey: 'experience.items.placeholderDigital.role',
      contractType: 'internship',
      startDateKey: 'experience.items.placeholderDigital.startDate',
      endDateKey: 'experience.items.placeholderDigital.endDate',
      locationType: 'on_site',
      locationKey: 'experience.items.placeholderDigital.location',
      descriptionKeys: [
        'experience.items.placeholderDigital.description.0',
        'experience.items.placeholderDigital.description.1',
        'experience.items.placeholderDigital.description.2',
      ],
      technologies: ['HTML', 'SCSS', 'JavaScript', 'Git'],
      startDate: '2022-02-01',
    },
  ];

  getExperiences(): Observable<Experience[]> {
    return of([...this.experiences].sort((a, b) => b.startDate.localeCompare(a.startDate)));
  }
}
