import { nanoid } from 'nanoid';
import Decimal from 'decimal.js';

export abstract class Transaction{
    private _id:string;
	private _transactionDate:Date;
    private _transactionAmount:Decimal;
    private _selfNote:string;

	constructor(date:Date, amount:Decimal, note:string = "", id:string = nanoid()){
		this._id = id;
		this._transactionDate = new Date(date.getTime());
        this._transactionAmount = new Decimal(amount);
        this._selfNote = note;
	}

	abstract summaryString():string;

    dateString():string{
		return this.transactionDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
	}

    abstract get type(): "spending" | "earning";

    get id():string{return this._id;}
    
    get transactionDate():Date{return new Date(this._transactionDate.getTime());}
    
    get transactionAmount():Decimal{return this._transactionAmount;}
    
    get selfNote():string{return this._selfNote;}
}
