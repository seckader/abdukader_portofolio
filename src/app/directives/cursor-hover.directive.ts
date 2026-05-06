import { Directive, HostListener, Input } from '@angular/core';
import { CursorService, CursorState } from '../services/cursor.service';

@Directive({
  selector: '[cursorHover]',
  standalone: false,
})
export class CursorHoverDirective {
  private state: CursorState = 'hover';

  @Input()
  cursorHoverLabel = '';

  @Input()
  set cursorHoverState(state: CursorState | '' | undefined) {
    this.state = state || 'hover';
  }

  @Input('cursorHover')
  set cursorHover(state: CursorState | '' | undefined) {
    this.state = state || 'hover';
  }

  constructor(private cursorService: CursorService) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.cursorService.setState(this.state, this.cursorHoverLabel);
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    event.stopPropagation();
    this.cursorService.setState(this.state, this.cursorHoverLabel);
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.cursorService.reset();
  }
}
