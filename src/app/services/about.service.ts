import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { About } from '../models/about.model';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly about: About = {
    firstName: 'Abdou Kader',
    lastName: 'SECK',
    roleKey: 'about.role',
    taglineKey: 'about.tagline',
    bioKeys: [
      'about.bio.paragraph1',
      'about.bio.paragraph2',
      'about.bio.paragraph3',
    ],
    availability: {
      available: true,
      labelKey: 'about.availability.available',
    },
    locationKey: 'about.location',
  };

  getAbout(): Observable<About> {
    return of(this.about);
  }
}
