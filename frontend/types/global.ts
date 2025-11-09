import { Merchant } from './finix';

export interface Item {
    id: string;
    name: string;
    price: number;
    currency: string;
}

export interface Address {
    line1: string;
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

export interface Buyer {
    id: string;
    entity: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export interface PaymentInstrument {
    id: string;
    name: string;
    token: string;
    identity: string;
    type: string;
}

export type { Merchant };
