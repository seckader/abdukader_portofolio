import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { About } from '../models/about.model';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly aboutBase: Omit<About, 'availability'> = {
    firstName: 'Abdou Kader',
    lastName: 'SECK',
    roleKey: 'about.role',
    taglineKey: 'about.tagline',
    bioKeys: [
      'about.bio.paragraph1',
      'about.bio.paragraph2',
      'about.bio.paragraph3',
    ],
    locationKey: 'about.location',
  };

  constructor(private contactService: ContactService) {}

  getAbout(): Observable<About> {
    return this.contactService.getContact().pipe(
      map(contact => ({
        ...this.aboutBase,
        availability: {
          available: contact.availability.available,
          labelKey: contact.availability.available
            ? 'about.availability.available'
            : 'about.availability.unavailable',
        },
      }))
    );
  }
}
