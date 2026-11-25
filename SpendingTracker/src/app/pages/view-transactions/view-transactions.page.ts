import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.page.html',
  styleUrls: ['./view-transactions.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class ViewTransactionsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
