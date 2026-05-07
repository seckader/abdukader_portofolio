import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Experience } from '../models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private readonly experiences: Experience[] = [
    {
      companyName: 'Géo-Plus',
      companyUrl: 'https://geo-plus.com/',
      roleKey: 'experience.items.geoplus.role',
      contractType: 'internship',
      startDateKey: 'experience.items.geoplus.startDate',
      endDateKey: 'experience.items.geoplus.endDate',
      locationType: 'on_site',
      locationKey: 'experience.items.geoplus.location',
      descriptionKeys: [
        'experience.items.geoplus.description.0',
        'experience.items.geoplus.description.1',
        'experience.items.geoplus.description.2',
        'experience.items.geoplus.description.3',
        'experience.items.geoplus.description.4',
      ],
      technologies: [
        'Angular',
        'TypeScript',
        'Node.js',
        'Express.js',
        'PostgreSQL',
        'PostHog',
        'Docker',
        'REST APIs',
        'Git',
      ],
      startDate: '2026-01-05',
    },
    {
      companyName: 'Sonatel',
      companyUrl: 'https://sonatel.sn/',
      roleKey: 'experience.items.sonatelcdd.role',
      contractType: 'fixed_term',
      startDateKey: 'experience.items.sonatelcdd.startDate',
      endDateKey: 'experience.items.sonatelcdd.endDate',
      locationType: 'on_site',
      locationKey: 'experience.items.sonatelcdd.location',
      descriptionKeys: [
        'experience.items.sonatelcdd.description.0',
        'experience.items.sonatelcdd.description.1',
        'experience.items.sonatelcdd.description.2',
        'experience.items.sonatelcdd.description.3',
        'experience.items.sonatelcdd.description.4',
      ],
      technologies: [
        'IP Network',
        'Telecom Networks',
        'Backhaul',
        'MW Transmission',
        'Traffic Analysis',
        'Fiber to the x',
        'Routing',
        'Switching',
        'TCP/IP',
        'GPON',
        'Monitoring'
      ],
      startDate: '2021-09-08',
    },
  ];

  getExperiences(): Observable<Experience[]> {
    return of([...this.experiences].sort((a, b) => b.startDate.localeCompare(a.startDate)));
  }
}
