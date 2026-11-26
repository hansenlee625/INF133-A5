import { Transaction } from "./transaction";

export class Spending extends Transaction{
    private _transactionLocation:string;
    private _beneficiary:string;

	constructor(date:Date, amount:number, note:string, location:string, beneficiary:string){
		super(date, amount, note);
		this._transactionLocation=location;
		this._beneficiary = beneficiary;
	}

	override summaryString():string{
        const baseSummary:string = `Spending on ${this.dateString()} ` +
         `at ${this._transactionLocation} ` +
         `with amount $${this.transactionAmount.toFixed(2)}, ` +
         `this spending was for ${this._beneficiary}.`;
        
        return this.selfNote ? `${baseSummary} Note: ${this.selfNote}` : baseSummary;
	}

    override get type(): "spending" {return "spending";}

    get transactionLocation():string{return this._transactionLocation;}

    get beneficiary():string{return this._beneficiary;}
}
