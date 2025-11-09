import React, { useState, FC, useEffect } from 'react';
import { Merchant, Item, Address, DateOfBirth } from '@/types/global';
import PaymentInstrumentForm from './PaymentInstrumentForm';

import { Identity, PaymentInstrument } from '@/types/finix';

interface MerchantSectionProps {}

const MerchantSection: FC<MerchantSectionProps> = () => {
  const [step, setStep] = useState(1);
  const [createdIdentity, setCreatedIdentity] = useState<Identity | null>(null);
  const [createdPaymentInstrument, setCreatedPaymentInstrument] = useState<PaymentInstrument | null>(null);
  const [newMerchantName, setNewMerchantName] = useState('');
  const [newMerchantEmail, setNewMerchantEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddressLine1, setBusinessAddressLine1] = useState('');
  const [businessAddressCity, setBusinessAddressCity] = useState('');
  const [businessAddressRegion, setBusinessAddressRegion] = useState('');
  const [businessAddressPostalCode, setBusinessAddressPostalCode] = useState('');
  const [businessAddressCountry, setBusinessAddressCountry] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [annualCardVolume, setAnnualCardVolume] = useState('');
  const [defaultStatementDescriptor, setDefaultStatementDescriptor] = useState('');
  const [hasAcceptedCreditCardsPreviously, setHasAcceptedCreditCardsPreviously] = useState(false);
  const [incorporationDateDay, setIncorporationDateDay] = useState('');
  const [incorporationDateMonth, setIncorporationDateMonth] = useState('');
  const [incorporationDateYear, setIncorporationDateYear] = useState('');
  const [maxTransactionAmount, setMaxTransactionAmount] = useState('');
  const [mcc, setMcc] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [phone, setPhone] = useState('');
  const [principalPercentageOwnership, setPrincipalPercentageOwnership] = useState('');
  const [taxId, setTaxId] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [personalAddressLine1, setPersonalAddressLine1] = useState('');
  const [personalAddressCity, setPersonalAddressCity] = useState('');
  const [personalAddressRegion, setPersonalAddressRegion] = useState('');
  const [personalAddressPostalCode, setPersonalAddressPostalCode] = useState('');
  const [personalAddressCountry, setPersonalAddressCountry] = useState('');

  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('BUSINESS_CHECKING');
  const [bankCode, setBankCode] = useState('');
  const [processor, setProcessor] = useState('DUMMY_V1');
  const [createdMerchant, setCreatedMerchant] = useState<Merchant | null>(null);
  const [showMerchantPlatform, setShowMerchantPlatform] = useState(false);
  const [selectedMerchantId, setSelectedMerchantId] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCurrency, setNewItemCurrency] = useState('USD');


  const [merchants, setMerchants] = useState<Merchant[]>([]); // State to hold merchants fetched from backend

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch('http://localhost:3001/merchants');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMerchants(data);
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
    };
    fetchMerchants();
  }, []);

  useEffect(() => {
    if (selectedMerchantId) {
      const fetchItems = async () => {
        try {
          const response = await fetch(`http://localhost:3001/merchants/${selectedMerchantId}/items`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };
      fetchItems();
    } else {
      setItems([]);
    }
  }, [selectedMerchantId]);

  const handleAddItem = async () => {
    if (!selectedMerchantId || !newItemName || !newItemPrice || !newItemCurrency) {
      alert('Please select a merchant and provide all item details.');
      return;
    }

    const newItemData = {
      name: newItemName,
      price: newItemPrice,
      currency: newItemCurrency,
    };

    try {
      const response = await fetch(`http://localhost:3001/merchants/${selectedMerchantId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create item: ${error.error || response.statusText}`);
      }

      const createdItem = await response.json();
      setItems([...items, createdItem]);

      // Clear form fields
      setNewItemName('');
      setNewItemPrice('');
      setNewItemCurrency('USD');
    } catch (error) {
      console.error('Error adding item:', error);
      alert((error as Error).message);
    }
  };

  const handleCreateIdentity = async () => {
    const identityData = {
      entity: {
        first_name: newMerchantName.split(' ')[0],
        last_name: newMerchantName.split(' ')[1] || '',
        email: newMerchantEmail,
        business_name: businessName,
        business_address: {
          line1: businessAddressLine1,
          city: businessAddressCity,
          region: businessAddressRegion,
          postal_code: businessAddressPostalCode,
          country: businessAddressCountry,
        },
        dob: {
          day: parseInt(dobDay) || 0,
          month: parseInt(dobMonth) || 0,
          year: parseInt(dobYear) || 0,
        },
        annual_card_volume: parseInt(annualCardVolume) || 0,
        default_statement_descriptor: defaultStatementDescriptor,
        has_accepted_credit_cards_previously: hasAcceptedCreditCardsPreviously,
        incorporation_date: {
          day: parseInt(incorporationDateDay) || 0,
          month: parseInt(incorporationDateMonth) || 0,
          year: parseInt(incorporationDateYear) || 0,
        },
        max_transaction_amount: parseInt(maxTransactionAmount) || 0,
        mcc: mcc,
        ownership_type: ownershipType,
        phone: phone,
        principal_percentage_ownership: parseInt(principalPercentageOwnership) || 0,
        tax_id: taxId,
        title: title,
        url: url,
        personal_address: {
            line1: personalAddressLine1,
            city: personalAddressCity,
            region: personalAddressRegion,
            postal_code: personalAddressPostalCode,
            country: personalAddressCountry,
        },
      },
      identity_roles: ['SELLER'],
      type: 'BUSINESS',
    };

    try {
      const response = await fetch('http://localhost:3001/identities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(identityData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create identity: ${error.error || response.statusText}`);
      }

      const createdIdentity = await response.json();
      setCreatedIdentity(createdIdentity);
      setStep(2);
    } catch (error) {
      console.error('Error creating identity:', error);
      alert((error as Error).message);
    }
  };

  const handleCreatePaymentInstrument = async () => {
    if (!createdIdentity || !accountNumber || !bankCode) {
        alert('Please fill in all bank account details.');
        return;
    }

    const paymentInstrumentData = {
        account_number: accountNumber,
        account_type: accountType,
        bank_code: bankCode,
        identity: createdIdentity.id,
        name: businessName,
        type: 'BANK_ACCOUNT',
    };

    try {
        const response = await fetch('http://localhost:3001/payment_instruments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentInstrumentData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create payment instrument: ${error.error || response.statusText}`);
        }

        const createdPaymentInstrument = await response.json();
        setCreatedPaymentInstrument(createdPaymentInstrument);
        setStep(3);
    } catch (error) {
        console.error('Error creating payment instrument:', error);
        alert((error as Error).message);
    }
  };

  const handleCreateMerchant = async () => {
    if (!createdIdentity) {
        alert('Please create an identity first.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/identities/${createdIdentity.id}/merchants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ processor }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create merchant: ${error.error || response.statusText}`);
        }

        const createdMerchant = await response.json();
        setCreatedMerchant(createdMerchant);
        setMerchants([...merchants, createdMerchant]);
        setStep(4);
    } catch (error) {
        console.error('Error creating merchant:', error);
        alert((error as Error).message);
    }
  };

  return (
    <div className="p-4">
      {!showMerchantPlatform ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Merchant Onboarding</h2>
          {step === 1 && (
            <div className="mb-8 p-4 border rounded-md shadow-sm">
              <h3 className="text-xl font-medium mb-4">Step 1: Create Identity</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Merchant Name" value={newMerchantName} onChange={(e) => setNewMerchantName(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="email" placeholder="Merchant Email" value={newMerchantEmail} onChange={(e) => setNewMerchantEmail(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Address Line 1" value={businessAddressLine1} onChange={(e) => setBusinessAddressLine1(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Address City" value={businessAddressCity} onChange={(e) => setBusinessAddressCity(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Address Region" value={businessAddressRegion} onChange={(e) => setBusinessAddressRegion(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Address Postal Code" value={businessAddressPostalCode} onChange={(e) => setBusinessAddressPostalCode(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Business Address Country" value={businessAddressCountry} onChange={(e) => setBusinessAddressCountry(e.target.value)} className="w-full p-2 border rounded-md" />
            <div className="flex space-x-2">
              <input type="number" placeholder="DOB Day" value={dobDay} onChange={(e) => setDobDay(e.target.value)} className="w-1/3 p-2 border rounded-md" />
              <input type="number" placeholder="DOB Month" value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} className="w-1/3 p-2 border rounded-md" />
              <input type="number" placeholder="DOB Year" value={dobYear} onChange={(e) => setDobYear(e.target.value)} className="w-1/3 p-2 border rounded-md" />
            </div>
            <input type="number" placeholder="Annual Card Volume" value={annualCardVolume} onChange={(e) => setAnnualCardVolume(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Default Statement Descriptor" value={defaultStatementDescriptor} onChange={(e) => setDefaultStatementDescriptor(e.target.value)} className="w-full p-2 border rounded-md" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={hasAcceptedCreditCardsPreviously} onChange={(e) => setHasAcceptedCreditCardsPreviously(e.target.checked)} className="form-checkbox" />
              <span>Has Accepted Credit Cards Previously</span>
            </label>
            <div className="flex space-x-2">
              <input type="number" placeholder="Incorporation Day" value={incorporationDateDay} onChange={(e) => setIncorporationDateDay(e.target.value)} className="w-1/3 p-2 border rounded-md" />
              <input type="number" placeholder="Incorporation Month" value={incorporationDateMonth} onChange={(e) => setIncorporationDateMonth(e.target.value)} className="w-1/3 p-2 border rounded-md" />
              <input type="number" placeholder="Incorporation Year" value={incorporationDateYear} onChange={(e) => setIncorporationDateYear(e.target.value)} className="w-1/3 p-2 border rounded-md" />
            </div>
            <input type="number" placeholder="Max Transaction Amount" value={maxTransactionAmount} onChange={(e) => setMaxTransactionAmount(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="MCC (e.g., 5812)" value={mcc} onChange={(e) => setMcc(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Ownership Type (e.g., PRIVATE)" value={ownershipType} onChange={(e) => setOwnershipType(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="tel" placeholder="Phone (+1 (555) 123-4567)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="number" placeholder="Principal Percentage Ownership" value={principalPercentageOwnership} onChange={(e) => setPrincipalPercentageOwnership(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Title (e.g., Owner)" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="url" placeholder="URL (https://www.example.com)" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Personal Address Line 1" value={personalAddressLine1} onChange={(e) => setPersonalAddressLine1(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Personal Address City" value={personalAddressCity} onChange={(e) => setPersonalAddressCity(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Personal Address Region" value={personalAddressRegion} onChange={(e) => setPersonalAddressRegion(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Personal Address Postal Code" value={personalAddressPostalCode} onChange={(e) => setPersonalAddressPostalCode(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Personal Address Country" value={personalAddressCountry} onChange={(e) => setPersonalAddressCountry(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
               <button onClick={handleCreateIdentity} className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Create Identity</button>
            </div>
          )}
          {step === 2 && (
            <div className="mb-8 p-4 border rounded-md shadow-sm">
              <h3 className="text-xl font-medium mb-4">Step 2: Add Bank Account</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="text" placeholder="Bank Code" value={bankCode} onChange={(e) => setBankCode(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <button onClick={handleCreatePaymentInstrument} className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Add Bank Account</button>
            </div>
          )}
          {step === 3 && (
            <div className="mb-8 p-4 border rounded-md shadow-sm">
              <h3 className="text-xl font-medium mb-4">Step 3: Create Merchant</h3>
          <button onClick={handleCreateMerchant} className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">Create Merchant</button>
            </div>
          )}
          {step === 4 && (
            <div className="mb-8 p-4 border rounded-md shadow-sm">
              <h3 className="text-xl font-medium mb-4">Onboarding Complete!</h3>
              <p>Merchant ID: {createdMerchant?.id}</p>
              <button onClick={() => setShowMerchantPlatform(true)}>Go to Merchant Platform</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Merchant Platform</h2>
          <div className="mb-8 p-4 border rounded-md shadow-sm">
            <h3 className="text-xl font-medium mb-4">Add Item to Merchant</h3>
            <div className="space-y-4">
              <select
                value={selectedMerchantId}
                onChange={(e) => setSelectedMerchantId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select Merchant</option>
                {merchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.merchant_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Item Name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="number"
                placeholder="Item Price"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Currency (e.g., USD)"
                value={newItemCurrency}
                onChange={(e) => setNewItemCurrency(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleAddItem}
                disabled={!selectedMerchantId}
                className={`w-full py-2 px-4 text-white rounded-md ${
                  selectedMerchantId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                Add Item
              </button>
            </div>
          </div>

          <h3 className="text-xl font-medium mb-4">Existing Items</h3>
          {items.length === 0 ? (
            <p>No items for this merchant.</p>
          ) : (
            <ul className="list-disc list-inside ml-4">
              {items.map((item) => (
                <li key={item.id} className="text-sm">
                  {item.name} - {item.currency} {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantSection;
