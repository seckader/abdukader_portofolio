import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.html',
  styleUrl: './main-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MainContentComponent {}
