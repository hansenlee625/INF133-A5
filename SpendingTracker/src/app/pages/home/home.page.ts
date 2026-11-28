import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast, IonInput } from '@ionic/angular';
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';
import { Transactions } from '../../services/transaction';
import { Transaction } from '../../data/transaction';
import { Spending } from '../../data/spending';
import { Earning } from '../../data/earning';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonToast, IonInput, CommonModule, FormsModule, ThemeSwitchComponent, BottomNavComponent],
})
export class HomePage implements OnInit {
  constructor(public transactions: Transactions){}
  ngOnInit() {console.log(this.allTransactions);}
  
  selectedForm: 'spending' | 'earning' | null = null;
  saving = signal(false);

  dateInput = '';
  amountInput = '';
  locationInput = '';
  beneficiaryInput = '';
  sourceInput = '';
  noteInput = '';

  toastOpen = false;
  toastMessage = '';

  get allTransactions():Transaction[]{return Transactions.AllTransactions;}

  get lastSpending(): Spending|undefined{ //last = most recent
    return Transactions.AllSpending.reduce<Spending|undefined>((latest, record) =>
      !latest || record.transactionDate.getTime() >= latest.transactionDate.getTime() ? record : latest,
      undefined
    );
  }

  get lastEarning(): Earning|undefined{ //last = most recent
    return Transactions.AllEarning.reduce<Earning | undefined>((latest, record) =>
      !latest || record.transactionDate.getTime() >= latest.transactionDate.getTime() ? record : latest,
      undefined
    );
  }

  private localDateTimeString(date:Date): string{return formatDate(date, 'yyyy-MM-ddTHH:mm', 'en-US');}

  private resetForm(): void{
    this.dateInput = this.localDateTimeString(new Date());
    this.amountInput = '';
    this.locationInput = '';
    this.beneficiaryInput = '';
    this.sourceInput = '';
    this.noteInput = '';
  }

  openSpendingForm(): void{
    this.resetForm();
    this.selectedForm = 'spending';
  }

  openEarningForm(): void{
    this.resetForm();
    this.selectedForm = 'earning';
  }

  cancelForm(): void{
    if(!this.saving()) this.selectedForm = null;
  }

  private showToast(message:string): void{
    this.toastMessage = message;
    this.toastOpen = true;
  }

  //Validate date and amount on spending + earning logging forms
  private validateDateAndAmount(): {date:Date; amount:Decimal}{
    if(!this.dateInput) throw new Error('Please enter a date AND time.');

    const date = new Date(this.dateInput);
    if(Number.isNaN(date.getTime())) throw new Error('Please enter a valid date AND time.');
    
    const input = this.amountInput.trim();
    
    if(!input) throw new Error('Please enter an amount in number only.');
    
    //Allow numbers up to two decimal places,
    //*leading decimal point permitted
    if(!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(input)){
      throw new Error('Enter a numeric amount with at most 2 decimal places.');
    }

    let amount: Decimal;
    try{
      amount = new Decimal(input);
    }
    catch{
      throw new Error('Please enter a valid amount in number with at most 2 decimal places.');
    }

    if (!amount.isFinite() || amount.lessThanOrEqualTo(0)) {
      throw new Error('Please enter a finite amount greater than zero.');
    }

    return { date, amount };
}

  async saveSpending(): Promise<void>{
    if (this.saving()) return;

    this.saving.set(true);
    try{
      const {date, amount} = this.validateDateAndAmount();
      const location = this.locationInput.trim();

      if(!location) throw new Error('Please enter a spending location.');

      const record = new Spending(date, amount, location, this.beneficiaryInput, this.noteInput);
      await this.transactions.logSpending(record);
      this.selectedForm = null;
      this.showToast('Spending record saved.');
    }
    catch(error){
      this.showToast(error instanceof Error ? error.message: 'Could not save spending record.');
    }
    finally{
      this.saving.set(false);
    }
  }

  async saveEarning(): Promise<void>{
    if (this.saving()) return;

    this.saving.set(true);
    try{
      const {date, amount} = this.validateDateAndAmount();

      const record = new Earning(date, amount, this.sourceInput, this.noteInput);
      await this.transactions.logEarning(record);
      this.selectedForm = null;
      this.showToast('Earning record saved.');
    }
    catch(error){
      this.showToast(error instanceof Error ? error.message : 'Could not save earning record.');
    }
    finally{
      this.saving.set(false);
    }
  }
}
