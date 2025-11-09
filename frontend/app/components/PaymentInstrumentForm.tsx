import React, { useState, FC } from 'react';

interface PaymentInstrumentFormProps {
    identityId: string;
}

const PaymentInstrumentForm: FC<PaymentInstrumentFormProps> = ({ identityId }) => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');

    const handleCreatePaymentInstrument = async () => {
        // Basic validation
        if (!name || !token) {
            alert('Please fill in all payment instrument details.');
            return;
        }

        const newPaymentInstrumentData = {
            name,
            token,
            identity: identityId,
            type: 'TOKEN',
        };

        try {
            const response = await fetch('http://localhost:3001/create-payment-instrument', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPaymentInstrumentData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to create payment instrument: ${error.error || response.statusText}`);
            }

            const createdPaymentInstrument = await response.json();
            alert(`Payment instrument created successfully: ${createdPaymentInstrument.id}`);

            // Clear form fields
            setName('');
            setToken('');

        } catch (error) {
            console.error('Error adding payment instrument:', error);
            alert((error as Error).message);
        }
    };

    return (
        <div className="mb-8 p-4 border rounded-md shadow-sm">
            <h3 className="text-xl font-medium mb-4">Create New Payment Instrument</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Name on Card" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-md" />
                <input type="text" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} className="w-full p-2 border rounded-md" />
                <button
                    onClick={handleCreatePaymentInstrument}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Create Payment Instrument
                </button>
            </div>
        </div>
    );
};

export default PaymentInstrumentForm;
