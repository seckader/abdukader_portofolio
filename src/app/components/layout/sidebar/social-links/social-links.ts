import { ChangeDetectionStrategy, Component } from '@angular/core';

interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'cv';
  download?: boolean;
}

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SocialLinksComponent {
  links: SocialLink[] = [
    { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com/', icon: 'twitter' },
    { label: 'CV', href: '/assets/cv/abdukader-cv.pdf', icon: 'cv', download: true },
  ];
}
