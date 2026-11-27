import { Service } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Spending } from '../data/spending';
import { Earning } from '../data/earning';
import Decimal from 'decimal.js';

interface StoredData{
  spending:{
    id: string;
    date: string;
    amount: string;
    location: string;
    beneficiary:string;
    note?:string;
  }[];
  earning:{
    id: string;
    date: string;
    amount: string;
    source:string;
    note?: string;
  }[];
}

export interface TransactionRecords{
  spending: Spending[];
  earning: Earning[];
}

@Service()
export class TransactionStorage {
    private readonly storageKey = 'spending-tracker-data';
    private readonly _storage:Promise<Storage>;
  
  constructor(private storage:Storage){
    this._storage = this.storage.create();
  }

  async load():Promise<TransactionRecords>{
    const storage = await this._storage;
    const saved:StoredData | null = await storage.get(this.storageKey);

    if(saved == null) return {spending:[], earning:[]};
    
    if(!Array.isArray(saved.spending) || !Array.isArray(saved.earning)){
      throw new Error('Saved transaction data has incorrect format.');
    }

    const spending = saved.spending.map(record => {
      return new Spending(
        new Date(record.date),
        new Decimal(record.amount),
        record.location,
        record.beneficiary,
        record.note,
        record.id
      );
    });

    const earning = saved.earning.map(record => {
      return new Earning(
        new Date(record.date),
        new Decimal(record.amount),
        record.source,
        record.note,
        record.id
      );
    });

    return {spending, earning};
  }

  async save(records:TransactionRecords):Promise<void>{
    const data:StoredData = {
      spending:records.spending.map(record => ({
        id:record.id,
        date:record.transactionDate.toISOString(),
        amount:record.transactionAmount.toString(),
        location:record.transactionLocation,
        beneficiary:record.beneficiary,
        note:record.selfNote
      })),
      earning:records.earning.map(record => ({
        id:record.id,
        date:record.transactionDate.toISOString(),
        amount:record.transactionAmount.toString(),
        source:record.earningSource,
        note:record.selfNote
      })),
    };

    const storage = await this._storage;
    await storage.set(this.storageKey, data);
  }
}
