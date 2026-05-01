import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  sections: NavSection[];

  constructor(private scrollSpyService: ScrollSpyService) {
    this.sections = this.scrollSpyService.sections;
  }

  goToSection(sectionId: string): void {
    this.scrollSpyService.scrollToSection(sectionId);
    this.linkSelected.emit();
  }
}
