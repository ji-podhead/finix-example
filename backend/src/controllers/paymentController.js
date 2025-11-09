import finixApi from '../services/finix.js';
import { paymentInstrumentSchema, createTransferSchema, bankAccountPaymentInstrumentSchema, tokenPaymentInstrumentSchema } from '../validation/schemas.js';

export const createTokenPaymentInstrument = async (req, res) => {
    console.log("Received request to create token payment instrument:", req.body);
    try {
        const { error, value } = tokenPaymentInstrumentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const paymentInstrument = await finixApi('/payment_instruments', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        res.status(201).json(paymentInstrument);
    } catch (error) {
        console.error("Error creating token payment instrument:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createBankAccountPaymentInstrument = async (req, res) => {
    console.log("Received request to create bank account payment instrument:", req.body);
    try {
        const { error, value } = bankAccountPaymentInstrumentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const paymentInstrument = await finixApi('/payment_instruments', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        res.status(201).json(paymentInstrument);
    } catch (error) {
        console.error("Error creating bank account payment instrument:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createTransfer = async (req, res) => {
    console.log("Received request to create transfer:", req.body);
    try {
        const { error, value } = createTransferSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const transfer = await finixApi('/transfers', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        res.status(201).json(transfer);
    } catch (error) {
        console.error("Error creating transfer:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createPaymentInstrument = async (req, res) => {
    console.log("Received request to create payment instrument:", req.body);
    try {
        const { error, value } = paymentInstrumentSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const paymentInstrument = await finixApi('/payment_instruments', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        res.status(201).json(paymentInstrument);
    } catch (error) {
        console.error("Error creating payment instrument:", error);
        res.status(500).json({ error: error.message || error });
    }
};
