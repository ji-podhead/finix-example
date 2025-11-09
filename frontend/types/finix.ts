import { Item, DateOfBirth } from './global';

export interface Identity {
    id: string;
    application: string;
    createdAt: string;
    updatedAt: string;
    entity: {
        business_address: {
            city: string;
            country: string;
            line1: string;
            line2: string;
            postal_code: string;
            region: string;
        };
        business_name: string;
        dob: {
            day: string;
            month: string;
            year: string;
        };
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        tax_id: string;
        title: string;
        url: string;
    };
    identity_roles: string[];
    type: string;
    tags: { [key: string]: string };
    _links: {
        self: {
            href: string;
        };
        application: {
            href: string;
        };
        merchants: {
            href: string;
        };
    };
}

export interface Transfer {
    id: string;
    application: string;
    createdAt: string;
    updatedAt: string;
    amount: number;
    currency: string;
    merchant: string;
    source: string;
    state: string;
    _links: {
        self: {
            href: string;
        };
        application: {
            href: string;
        };
        merchant: {
            href: string;
        };
        source: {
            href: string;
        };
        destination: {
            href: string;
        };
    };
}

export interface PaymentInstrument {
    id: string;
    application: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    type: string;
    identity: string;
    token: string;
    third_party_token: string;
    _links: {
        self: {
            href: string;
        };
        application: {
            href: string;
        };
        identity: {
            href: string;
        };
    };
}

export interface Merchant {
    id: string;
    identityId: string;
    application: string;
    createdAt: string;
    updatedAt: string;
    annual_card_volume: number;
    businessName?: string;
    email?: string;
    items?: Item[];
    business_address: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        region: string;
    };
    default_statement_descriptor: string;
    has_accepted_credit_cards_previously: boolean;
    dob?: DateOfBirth;
    incorporationDate?: DateOfBirth;
    incorporation_date: {
        day: string;
        month: string;
        year: string;
    };
    max_transaction_amount: number;
    mcc: string;
    merchant_name: string;
    ownership_type: string;
    phone: string;
    principal_percentage_ownership: number;
    processor: string;
    tax_id: string;
    title: string;
    url: string;
    _links: {
        self: {
            href: string;
        };
        application: {
            href: string;
        };
        identity: {
            href: string;
        };
        payment_instruments: {
            href: string;
        };
        transfers: {
            href: string;
        };
    };
}
