document.addEventListener('DOMContentLoaded', () => {
    const processTransactionBtn = document.getElementById('process-transaction-btn');
    const triggerDisputeBtn = document.getElementById('trigger-dispute-btn');
    const triggerRefundBtn = document.getElementById('trigger-refund-btn');
    const apiResponseEl = document.getElementById('api-response');
    const transactionTypeEl = document.getElementById('transaction-type');
    const fraudSessionIdEl = document.getElementById('fraud-session-id');
    const idempotencyIdEl = document.getElementById('idempotency-id');
    const merchantIdEl = document.getElementById('merchant-id');
    const applicationIdEl = document.getElementById('application-id');

    // Buyer fields
    const buyerFirstNameEl = document.getElementById('buyer-firstname');
    const buyerLastNameEl = document.getElementById('buyer-lastname');
    const buyerEmailEl = document.getElementById('buyer-email');

    const displayResponse = (data) => {
        apiResponseEl.textContent = JSON.stringify(data, null, 2);
    };

    const generateId = (prefix) => {
        return prefix + Math.random().toString(36).substring(2, 15);
    };

    const simulateApiCall = (data) => {
        return new Promise(resolve => setTimeout(() => resolve(data), 500));
    };

    const processTransaction = async () => {
        const transactionType = transactionTypeEl.value;
        const fraudSessionId = fraudSessionIdEl.value;
        const idempotencyId = idempotencyIdEl.value;
        const merchantId = merchantIdEl.value;
        const applicationId = applicationIdEl.value;

        try {
            // 1. Simulate Identity creation
            const firstName = buyerFirstNameEl.value;
            const lastName = buyerLastNameEl.value;
            const email = buyerEmailEl.value;

            const identity = await simulateApiCall({
                "id": generateId("ID"),
                "created_at": new Date().toISOString(),
                "updated_at": new Date().toISOString(),
                "application": applicationId,
                "entity": {
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email
                },
                "tags": {
                    "customer_id": generateId("cust")
                }
            });
            displayResponse({ step: "Identity Creation", response: identity });

            // 2. Simulate Payment Instrument creation
            const paymentInstrument = await simulateApiCall({
                "id": generateId("PI"),
                "created_at": new Date().toISOString(),
                "updated_at": new Date().toISOString(),
                "type": "TOKEN",
                "identity": identity.id,
            });
            displayResponse({ step: "Payment Instrument Creation", response: paymentInstrument });

            // 3. Simulate Transfer creation
            if (transactionType === 'successful') {
                const transfer = await simulateApiCall({
                    "id": generateId("TR"),
                    "created_at": new Date().toISOString(),
                    "updated_at": new Date().toISOString(),
                    "amount": 10000,
                    "currency": "USD",
                    "state": "SUCCEEDED",
                    "merchant": merchantId,
                    "source": paymentInstrument.id,
                    "tags": {
                        "fraud_session_id": fraudSessionId,
                        "idempotency_id": idempotencyId
                    }
                });
                displayResponse({ step: "Transfer Creation", response: transfer });
            } else {
                const error = await simulateApiCall({
                    "errors": [{
                        "code": "DECLINED",
                        "message": "The card was declined for an unknown reason.",
                        "log_code": "card_declined"
                    }]
                });
                displayResponse({ step: "Transfer Creation", response: error });
            }
        } catch (error) {
            displayResponse({ error: "An unexpected error occurred during the simulation." });
        }
    };

    const triggerDispute = () => {
        const mockDisputeResponse = {
            "id": generateId("DI"),
            "created_at": new Date().toISOString(),
            "updated_at": new Date().toISOString(),
            "amount": 10000,
            "currency": "USD",
            "state": "PENDING",
            "transfer": generateId("TR"),
            "reason": "FRAUDULENT"
        };
        displayResponse(mockDisputeResponse);
    };

    const triggerRefund = () => {
        const mockRefundResponse = {
            "id": generateId("RF"),
            "created_at": new Date().toISOString(),
            "updated_at": new Date().toISOString(),
            "amount": 10000,
            "currency": "USD",
            "state": "SUCCEEDED",
            "transfer": generateId("TR")
        };
        displayResponse(mockRefundResponse);
    };

    processTransactionBtn.addEventListener('click', processTransaction);
    triggerDisputeBtn.addEventListener('click', triggerDispute);
    triggerRefundBtn.addEventListener('click', triggerRefund);

    // Initial message
    displayResponse({ message: "Select your options and process a transaction." });
});
