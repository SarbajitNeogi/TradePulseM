export interface LinkInterface {
    readonly id : number,
    title : string,
    path : string
}

export interface ProfileInterface {
    _id : string,
    name : string,
    email : string,
    balance : number,
    balancesheet : number[],
    activities : ActivityInterface[]
}

export interface ActivityInterface {
    time : any,
    activity : string
}

export interface SymbolDataInterface {
    symbol: string;
    screener: string;
    exchange: string;
    company_name: string;
    market: string;
    path: string;
  }