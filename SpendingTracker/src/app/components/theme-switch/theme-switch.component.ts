import { Component, OnInit } from '@angular/core';
import { IonIcon, IonToggle } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sunnyOutline, moonOutline } from 'ionicons/icons';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss'],
  imports: [IonIcon, IonToggle],
})
export class ThemeSwitchComponent implements OnInit {
  isDark = false;
  constructor() {
    addIcons({moonOutline, sunnyOutline});
  }

  ngOnInit() {
    //Restore saved theme or use OS theme preference.
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === null
     ? window.matchMedia('(prefers-color-scheme: dark)').matches
     : savedTheme === 'dark';
    this.applyTheme();
  }

  private applyTheme():void{
    document.documentElement.classList.toggle('ion-palette-dark', this.isDark);
  }

  setDarkMode(enabled:boolean):void{
    this.isDark = enabled;
    localStorage.setItem('theme', enabled ? 'dark' : 'light');
    this.applyTheme();
  }
}
