import { Injectable, signal } from '@angular/core';

export type CursorState = 'default' | 'hover' | 'hidden' | 'text' | 'drag';

@Injectable({
  providedIn: 'root',
})
export class CursorService {
  readonly state = signal<CursorState>('default');
  readonly label = signal<string>('');

  setState(state: CursorState, label = ''): void {
    this.state.set(state);
    this.label.set(label);
  }

  reset(): void {
    this.setState('default');
  }
}
