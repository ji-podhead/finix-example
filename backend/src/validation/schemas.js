import Joi from 'joi';

export const identitySchema = Joi.object({
    entity: Joi.object({
        first_name: Joi.string().optional(),
        last_name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        business_name: Joi.string().optional(),
        business_address: Joi.object({
            line1: Joi.string().optional(),
            city: Joi.string().optional(),
            region: Joi.string().optional(),
            postal_code: Joi.string().optional(),
            country: Joi.string().optional(),
        }).optional(),
        dob: Joi.object({
            day: Joi.number().integer().min(1).max(31).optional(),
            month: Joi.number().integer().min(1).max(12).optional(),
            year: Joi.number().integer().min(1900).max(2023).optional(),
        }).optional(),
        annual_card_volume: Joi.number().integer().min(0).optional(),
        default_statement_descriptor: Joi.string().optional(),
        has_accepted_credit_cards_previously: Joi.boolean().optional(),
        incorporation_date: Joi.object({
            day: Joi.number().integer().min(1).max(31).optional(),
            month: Joi.number().integer().min(1).max(12).optional(),
            year: Joi.number().integer().min(1900).max(2023).optional(),
        }).optional(),
        max_transaction_amount: Joi.number().integer().min(0).optional(),
        mcc: Joi.string().optional(),
        ownership_type: Joi.string().optional(),
        phone: Joi.string().optional(),
        principal_percentage_ownership: Joi.number().integer().min(0).max(100).optional(),
        tax_id: Joi.string().optional(),
        title: Joi.string().optional(),
        url: Joi.string().uri().optional(),
        personal_address: Joi.object({
            line1: Joi.string().optional(),
            city: Joi.string().optional(),
            region: Joi.string().optional(),
            postal_code: Joi.string().optional(),
            country: Joi.string().optional(),
        }).optional(),
    }).optional(),
    identity_roles: Joi.array().items(Joi.string().valid('SELLER', 'BUYER')).optional(),
    type: Joi.string().valid('BUSINESS', 'PERSONAL').optional(),
});

export const bankAccountPaymentInstrumentSchema = Joi.object({
    identity: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().valid('BANK_ACCOUNT').required(),
    account_number: Joi.string().required(),
    account_type: Joi.string().required(),
    bank_code: Joi.string().required(),
});

export const tokenPaymentInstrumentSchema = Joi.object({
    identity: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().valid('TOKEN').required(),
    token: Joi.string().required(),
});

export const paymentInstrumentSchema = Joi.alternatives().try(
    bankAccountPaymentInstrumentSchema,
    tokenPaymentInstrumentSchema
);

export const merchantSchema = Joi.object({
    processor: Joi.string().required(),
});

export const buyerSchema = Joi.object({
    entity: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional(),
        personal_address: Joi.object({
            line1: Joi.string().required(),
            city: Joi.string().required(),
            region: Joi.string().required(),
            postal_code: Joi.string().required(),
            country: Joi.string().required(),
            line2: Joi.string().optional(),
        }).optional(),
    }).required(),
    identity_roles: Joi.array().items(Joi.string().valid('BUYER')).required(),
    type: Joi.string().valid('PERSONAL').required(),
    tags: Joi.object().optional(),
});

export const createTransferSchema = Joi.object({
    amount: Joi.number().integer().min(1).required(),
    currency: Joi.string().required(),
    source: Joi.string().required(),
    merchant: Joi.string().required(),
    identity: Joi.string().required(),
});
