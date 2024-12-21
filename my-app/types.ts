export interface Safe {
  currency: 'dinar' | 'dollar';
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  safes: {
    dinar: Safe;
    dollar: Safe;
  };
}

export interface ExchangeRate {
  dinarToDollar: number;
  dollarToDinar: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: 'deposit' | 'withdraw' | 'exchange' | 'transfer';
  amount: number;
  fromCurrency: 'dinar' | 'dollar';
  toCurrency?: 'dinar' | 'dollar';
  date: Date;
  toCustomerId?: string; // For transfer transactions
  note?: string; // Add this line
}

