import { Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {

  constructor(private translateService: TranslateService) {}
  
  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    const browserLang = this.translateService.getBrowserLang();
    const defaultLang = savedLang || (browserLang?.match(/fr|en/) ? browserLang : 'fr');

    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setFallbackLang('fr');
    this.translateService.use(defaultLang);
  }
  
}
