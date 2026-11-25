import { Transaction } from "./transaction";

export class Earning extends Transaction{
    private _earningSource:string;

    constructor(date:Date, amount:number, note:string, source:string){
		super(date, amount, note);
        this._earningSource = source;
	}

	override summaryString():string{
        var baseSummary:string = `Earning on ${this.dateString()} ` +
         `from ${this._earningSource} ` +
         `with amount $${this.transactionAmount.toFixed(2)}.`;
        
        return this.selfNote ? `${baseSummary} Note: ${this.selfNote}` : baseSummary;
	}

    override get type(): "earning" {return "earning";}

    get earningSource():string{return this._earningSource;}
}
