import finixApi from '../services/finix.js';

export const createPaymentInstrument = async (req, res) => {
    console.log("Received request to create payment instrument:", req.body);
    try {
        const { token, type, identity, name, third_party_token } = req.body;

        const paymentInstrumentBody = {
            identity,
            name,
            type: "TOKEN",
        };

        if (token) {
            paymentInstrumentBody.token = token;
        } else if (third_party_token) {
            paymentInstrumentBody.third_party_token = third_party_token;
            paymentInstrumentBody.type = type;
        }

        const paymentInstrument = await finixApi('/payment_instruments', {
            method: 'POST',
            body: JSON.stringify(paymentInstrumentBody),
        });

        res.status(201).json(paymentInstrument);
    } catch (error) {
        console.error("Error creating payment instrument:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createTransfer = async (req, res) => {
    console.log("Received request to create transfer:", req.body);
    try {
        const { amount, currency, source, merchant, identity, googlePayToken } = req.body;

        let paymentSource = source;

        if (googlePayToken) {
            const paymentInstrument = await finixApi('/payment_instruments', {
                method: 'POST',
                body: JSON.stringify({
                    third_party_token: googlePayToken,
                    type: "GOOGLE_PAY",
                    identity: identity,
                    merchant_identity: "ID12345",
                }),
            });
            paymentSource = paymentInstrument.id;
        }

        const transfer = await finixApi('/transfers', {
            method: 'POST',
            body: JSON.stringify({
                amount: Math.round(parseFloat(amount)),
                currency,
                merchant,
                source: paymentSource,
            }),
        });

        res.status(201).json(transfer);
    } catch (error) {
        console.error("Error creating transfer:", error);
        res.status(500).json({ error: error.message || error });
    }
};
