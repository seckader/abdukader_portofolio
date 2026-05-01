import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../services/animation';

import { PreloaderComponent } from './preloader';

describe('Preloader', () => {
  let component: PreloaderComponent;
  let fixture: ComponentFixture<PreloaderComponent>;

  const animationServiceMock = {
    animatePreloaderIn: (_counter: Element, _status: Element, _progress: Element, onComplete: () => void) => onComplete(),
    animateCounter: (_onUpdate: (value: number) => void, onComplete: () => void) => onComplete(),
    animatePreloaderOut: (_preloader: Element, onComplete: () => void) => onComplete(),
    killAll: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PreloaderComponent,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: AnimationService, useValue: animationServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
