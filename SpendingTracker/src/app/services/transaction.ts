import { Service } from '@angular/core';
import { TransactionRecords, TransactionStorage } from './transaction-storage';
import { Transaction } from '../data/transaction';
import { Spending } from '../data/spending';
import { Earning } from '../data/earning';

@Service()
export class Transactions {
	public static AllTransactions:Transaction[] = [];
	public static AllSpending:Spending[] = [];
	public static AllEarning:Earning[] = [];

  public loading = true;
  public loadError: string | null = null;

  private readonly _storage:Promise<void>;
  private queue:Promise<void> = Promise.resolve();

	constructor(private transactionStorage:TransactionStorage){
    this._storage = this.loadInitialData();
	}

  private async loadInitialData(): Promise<void>{
    try{
      const records = await this.transactionStorage.load();
      this.setArrays(records);
    }
    catch{
      this.loadError = "Could not load saved data. Changes disabled.";
    }
    finally{
      this.loading = false;
    }
  }

  // --- Helpers for keeping both arrays in sync when recording/deleting a transaction ---
  //Remove spending/earning entry with given ID, or throws an error if not found
  private removeRecord(records:Transaction[], id:string):void{
    const index = records.findIndex(record => record.id === id);
    if(index === -1) throw new Error("Remove: Record not found.");
    records.splice(index, 1);
  }

  //Queues a change, save it, and updates the view arrays if saving succeeds
  private changeRecords(change:(entries:TransactionRecords) => void):Promise<void>{
    const operation = this.queue.then(async () => {
      await this._storage;
      if(this.loadError) throw new Error(this.loadError);
      
      const records:TransactionRecords = {
        spending:Transactions.AllSpending.slice(),
        earning:Transactions.AllEarning.slice()
      };

      change(records);
      await this.transactionStorage.save(records);
      this.setArrays(records);
    });

    // Allow later operations to run even if this one fails
    this.queue = operation.then(() => undefined, () => undefined);
    return operation;
  }

  //Updates the existing arrays in place with the provided spending + earning records
  private setArrays(records:TransactionRecords):void{
    const spending = records.spending.slice();
    const earning = records.earning.slice();
    Transactions.AllTransactions.length = 0;
    Transactions.AllSpending.length = 0;
    Transactions.AllEarning.length = 0;

    spending.forEach((record) => {
      Transactions.AllTransactions.push(record);
      Transactions.AllSpending.push(record);
    });
    earning.forEach((record) => {
      Transactions.AllTransactions.push(record);
      Transactions.AllEarning.push(record);
    });
  }


  // --- Add ---
	public logSpending(record:Spending):Promise<void>{
    return this.changeRecords(records => {
      records.spending.push(record);
    });
  }

	public logEarning(record:Earning):Promise<void>{
    return this.changeRecords(records => {
      records.earning.push(record);
    });
	}

	// --- Delete ---
  public deleteSpending(id:string):Promise<void>{
    return this.changeRecords(records => {
      this.removeRecord(records.spending, id);
    });
  }

  public deleteEarning(id:string):Promise<void>{
    return this.changeRecords(records => {
      this.removeRecord(records.earning, id);
    });
  }
}
