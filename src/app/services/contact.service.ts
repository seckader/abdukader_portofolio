import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly isBrowser: boolean;

  private readonly contact: Contact = {
    email: 'hello@example.com',
    socialLinks: [
      { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
      { label: 'X', href: 'https://x.com/', icon: 'twitter' },
    ],
    availability: {
      available: true,
      messageKey: 'contact.availability.open',
    },
    missionKeys: [
      'contact.missions.freelance',
      'contact.missions.fulltime',
      'contact.missions.consulting',
    ],
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getContact(): Observable<Contact> {
    return of(this.contact);
  }

  async copyEmail(): Promise<boolean> {
    if (!this.isBrowser) return false;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(this.contact.email);
      return true;
    }

    return this.copyWithFallback(this.contact.email);
  }

  sendEmail(): void {
    if (!this.isBrowser) return;

    const subject = encodeURIComponent('Portfolio contact');
    window.location.href = `mailto:${this.contact.email}?subject=${subject}`;
  }

  private copyWithFallback(value: string): boolean {
    const textarea = this.document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    this.document.body.appendChild(textarea);
    textarea.select();

    const copied = this.document.execCommand('copy');
    textarea.remove();

    return copied;
  }
}
