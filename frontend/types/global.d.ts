export interface Buyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
}

export interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  items: Item[];
  businessName: string;
  businessAddress: Address;
  dob: DateOfBirth;
  annualCardVolume: number;
  defaultStatementDescriptor: string;
  hasAcceptedCreditCardsPreviously: boolean;
  incorporationDate: DateOfBirth;
  maxTransactionAmount: number;
  mcc: string;
  ownershipType: string;
  phone: string;
  principalPercentageOwnership: number;
  taxId: string;
  title: string;
  url: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  currency: string;
}

export interface FinixForm {
  submit: (environment: string, applicationId: string, callback: (err: any, res: any) => void) => void;
}

export interface FormState {
  [key: string]: any;
}

export interface BinInformation {
  [key: string]: any;
}

export {};
