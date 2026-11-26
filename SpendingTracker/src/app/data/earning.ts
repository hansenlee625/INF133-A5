import { Transaction } from "./transaction";
import Decimal from 'decimal.js';

export class Earning extends Transaction{
    private _earningSource:string;

    constructor(date:Date, amount:Decimal, note:string, source:string, id?:string){
		super(date, amount, note, id);
        this._earningSource = source;
	}

	override summaryString():string{
        const baseSummary:string = `Earning on ${this.dateString()} ` +
         `from ${this._earningSource} ` +
         `with amount $${this.transactionAmount.toFixed(2)}.`;
        
        return this.selfNote ? `${baseSummary} Note: ${this.selfNote}` : baseSummary;
	}

    override get type(): "earning" {return "earning";}

    get earningSource():string{return this._earningSource;}

    toJSON(){
        return{
            id: this.id,
            type: this.type,
            date: this.transactionDate.toISOString(),
            amount: this.transactionAmount.toString(),
            source: this._earningSource,
            note: this.selfNote
        };
    }
}
