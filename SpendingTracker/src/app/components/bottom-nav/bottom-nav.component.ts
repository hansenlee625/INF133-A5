import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonFooter, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
  imports: [RouterLink, IonButton, IonFooter, IonToolbar]
})
export class BottomNavComponent{
  @Input() currentView: 'log' | 'view' = 'log';
}
