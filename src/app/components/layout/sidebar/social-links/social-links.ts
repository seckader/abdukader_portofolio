import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ContactSocialLink } from '../../../../models/contact.model';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SocialLinksComponent implements OnInit, OnDestroy {
  @ViewChildren('socialLink') private socialLinkRefs!: QueryList<ElementRef<HTMLElement>>;

  links: ContactSocialLink[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.contactService.getContact()
      .pipe(takeUntil(this.destroy$))
      .subscribe(contact => {
        this.links = contact.socialLinks;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLinkElements(): HTMLElement[] {
    return this.socialLinkRefs?.map(ref => ref.nativeElement) ?? [];
  }
}
