import { nanoid } from 'nanoid';

export class Transaction{
    private _id:string;
	private _transactionDate:Date;
    private _transactionAmount:number;
    private _selfNote:string;

	constructor(date:Date = new Date(), amount:number = 0, note:string = ""){
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged transactions the same).
		this._id = nanoid();
		this._transactionDate = new Date(date.getTime());
        this._transactionAmount = amount;
        this._selfNote = note;
	}

	summaryString():string{
		return "Unknown transaction";
	}

	dateString():string{
		return this.transactionDate.toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"});
	}

    get id():string{return this._id;}
    
    get transactionDate():Date{return new Date(this._transactionDate.getTime());}
    
    get transactionAmount():number{return this._transactionAmount;}
    
    get selfNote():string{return this._selfNote;}
    
    get type():"spending" | "earning" | "unknown" {return "unknown";}
}
