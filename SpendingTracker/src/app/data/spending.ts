import { Transaction } from "./transaction";

export class Spending extends Transaction{
    private _transactionLocation:string;
    private _forWhom:string;

	constructor(date:Date, amount:number, note:string, location:string, forWhom:string){
		super(date, amount, note);
		this._transactionLocation=location;
		this._forWhom = forWhom;
	}

	override summaryString():string{
        var baseSummary:string = `Spending on ${this.transactionDate} ` +
         `at ${this.dateString()} ` +
         `with amount $${this.transactionAmount.toFixed(2)}, ` +
         `this spending was for ${this._forWhom}.`;
        
        return this.selfNote ? `${baseSummary} Note: ${this.selfNote}` : baseSummary;
	}

    override get type(): "spending" {return "spending";}

    get transactionLocation():string{return this._transactionLocation;}

    get forWhom():string{return this._forWhom;}
}
