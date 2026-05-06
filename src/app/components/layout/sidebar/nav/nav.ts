import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { NavSection, ScrollSpyService } from '../../../../services/scroll-spy';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class NavComponent {
  @Input() activeSection = 'about';
  @Output() linkSelected = new EventEmitter<void>();
  @ViewChildren('navLink') private navLinkRefs!: QueryList<ElementRef<HTMLElement>>;

  sections: NavSection[];

  constructor(private scrollSpyService: ScrollSpyService) {
    this.sections = this.scrollSpyService.sections;
  }

  goToSection(sectionId: string): void {
    this.scrollSpyService.scrollToSection(sectionId);
    this.linkSelected.emit();
  }

  getLinkElements(): HTMLElement[] {
    return this.navLinkRefs?.map(ref => ref.nativeElement) ?? [];
  }
}
