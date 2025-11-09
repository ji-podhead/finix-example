import React, { useState, FC, useEffect } from 'react';
import { Merchant, Item, Address, DateOfBirth } from '@/types/global';

interface MerchantSectionProps {
  // merchants: Merchant[]; // Removed as we will fetch merchants from backend
  // addMerchant: (merchant: Merchant) => void; // Removed as we will call backend API
  addItemToMerchant: (merchantId: string, item: Item) => void;
}

const MerchantSection: FC<MerchantSectionProps> = ({ addItemToMerchant }) => {
  const [activeSubTab, setActiveSubTab] = useState<'createMerchant' | 'merchantPlatform'>('createMerchant');
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

  const [merchants, setMerchants] = useState<Merchant[]>([]); // State to hold merchants fetched from backend
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedMerchantId, setSelectedMerchantId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCurrency, setNewItemCurrency] = useState('USD');

  // Fetch merchants on component mount
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

  const handleAddMerchant = async () => {
    // Basic validation
    if (!newMerchantName || !newMerchantEmail || !businessName || !businessAddressLine1 || !businessAddressCity || !businessAddressRegion || !businessAddressPostalCode || !businessAddressCountry || !dobDay || !dobMonth || !dobYear || !annualCardVolume || !defaultStatementDescriptor || !incorporationDateDay || !incorporationDateMonth || !incorporationDateYear || !maxTransactionAmount || !mcc || !ownershipType || !phone || !principalPercentageOwnership || !taxId || !title || !url) {
      alert('Please fill in all merchant details.');
      return;
    }

    const newMerchantData = {
      name: newMerchantName,
      email: newMerchantEmail,
      items: [], // Items will be added separately
      businessName: businessName,
      businessAddress: {
        line1: businessAddressLine1,
        city: businessAddressCity,
        region: businessAddressRegion,
        postal_code: businessAddressPostalCode,
        country: businessAddressCountry,
      },
      dob: {
        day: parseInt(dobDay),
        month: parseInt(dobMonth),
        year: parseInt(dobYear),
      },
      annualCardVolume: parseFloat(annualCardVolume),
      defaultStatementDescriptor: defaultStatementDescriptor,
      hasAcceptedCreditCardsPreviously: hasAcceptedCreditCardsPreviously,
      incorporationDate: {
        day: parseInt(incorporationDateDay),
        month: parseInt(incorporationDateMonth),
        year: parseInt(incorporationDateYear),
      },
      maxTransactionAmount: parseFloat(maxTransactionAmount),
      mcc: mcc,
      ownershipType: ownershipType,
      phone: phone,
      principalPercentageOwnership: parseInt(principalPercentageOwnership),
      taxId: taxId,
      title: title,
      url: url,
    };

    try {
      const response = await fetch('http://localhost:3001/merchants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMerchantData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create merchant: ${error.error || response.statusText}`);
      }

      const createdMerchant = await response.json();
      setMerchants([...merchants, createdMerchant]); // Add new merchant to state

      // Clear form fields
      setNewMerchantName('');
      setNewMerchantEmail('');
      setBusinessName('');
      setBusinessAddressLine1('');
      setBusinessAddressCity('');
      setBusinessAddressRegion('');
      setBusinessAddressPostalCode('');
      setBusinessAddressCountry('');
      setDobDay('');
      setDobMonth('');
      setDobYear('');
      setAnnualCardVolume('');
      setDefaultStatementDescriptor('');
      setHasAcceptedCreditCardsPreviously(false);
      setIncorporationDateDay('');
      setIncorporationDateMonth('');
      setIncorporationDateYear('');
      setMaxTransactionAmount('');
      setMcc('');
      setOwnershipType('');
      setPhone('');
      setPrincipalPercentageOwnership('');
      setTaxId('');
      setTitle('');
      setUrl('');

    } catch (error) {
      console.error('Error adding merchant:', error);
      alert((error as Error).message);
    }
  };

  const handleAddItem = () => {
    if (selectedMerchantId && newItemName && newItemPrice && newItemCurrency) {
      const newItem: Item = {
        id: `item-${Date.now()}`,
        name: newItemName,
        price: parseFloat(newItemPrice),
        currency: newItemCurrency,
      };
      addItemToMerchant(selectedMerchantId, newItem);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemCurrency('USD');
    } else {
      alert('Please select a merchant and provide item details.');
    }
  };

  return (
    <React.Fragment>
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Merchant Section</h2>

      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 text-lg ${activeSubTab === 'createMerchant' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveSubTab('createMerchant')}
        >
          Create Merchant
        </button>
        <button
          className={`py-2 px-4 text-lg ${activeSubTab === 'merchantPlatform' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveSubTab('merchantPlatform')}
        >
          Merchant Platform
        </button>
      </div>

      {activeSubTab === 'createMerchant' && (
        <div className="mb-8 p-4 border rounded-md shadow-sm">
          <h3 className="text-xl font-medium mb-4">Create New Merchant</h3>
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

            <button
              onClick={handleAddMerchant}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Merchant
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'merchantPlatform' && (
        <React.Fragment>
          {/* Add Item to Merchant Form */}
          {merchants.length > 0 && (
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
                      {merchant.name}
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
          )}

          {/* Display Merchants and their Items */}
          <h3 className="text-xl font-medium mb-4">Existing Merchants</h3>
          {merchants.length === 0 ? (
            <p>No merchants created yet.</p>
          ) : (
            <div className="flex space-x-4">
              <div className="w-1/3">
                <ul className="space-y-2">
                  {merchants.map((merchant) => (
                    <li key={merchant.id} onClick={() => setSelectedMerchant(merchant)} className="cursor-pointer p-2 border rounded-md hover:bg-gray-100">
                      {merchant.name} ({merchant.id})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-2/3">
                {selectedMerchant && (
                  <div className="p-4 border rounded-md shadow-sm bg-gray-50">
                    <h4 className="text-lg font-semibold">{selectedMerchant.name}</h4>
                    <p>Email: {selectedMerchant.email}</p>
                    <p>Business Name: {selectedMerchant.businessName}</p>
                    {selectedMerchant.businessAddress && <p>Address: {selectedMerchant.businessAddress.line1}, {selectedMerchant.businessAddress.city}, {selectedMerchant.businessAddress.region} {selectedMerchant.businessAddress.postal_code}, {selectedMerchant.businessAddress.country}</p>}
                    {selectedMerchant.dob && <p>DOB: {selectedMerchant.dob.day}/{selectedMerchant.dob.month}/{selectedMerchant.dob.year}</p>}
                    <p>Annual Card Volume: {selectedMerchant.annualCardVolume}</p>
                    <p>Default Statement Descriptor: {selectedMerchant.defaultStatementDescriptor}</p>
                    <p>Has Accepted Credit Cards Previously: {selectedMerchant.hasAcceptedCreditCardsPreviously ? 'Yes' : 'No'}</p>
                    {selectedMerchant.incorporationDate && <p>Incorporation Date: {selectedMerchant.incorporationDate.day}/{selectedMerchant.incorporationDate.month}/{selectedMerchant.incorporationDate.year}</p>}
                    <p>Max Transaction Amount: {selectedMerchant.maxTransactionAmount}</p>
                    <p>MCC: {selectedMerchant.mcc}</p>
                    <p>Ownership Type: {selectedMerchant.ownershipType}</p>
                    <p>Phone: {selectedMerchant.phone}</p>
                    <p>Principal Percentage Ownership: {selectedMerchant.principalPercentageOwnership}%</p>
                    <p>Tax ID: {selectedMerchant.taxId}</p>
                    <p>Title: {selectedMerchant.title}</p>
                    <p>URL: {selectedMerchant.url}</p>
                    <h5 className="text-md font-medium mt-4">Items:</h5>
                    {selectedMerchant.items && selectedMerchant.items.length === 0 ? (
                      <p className="text-sm text-gray-600">No items for this merchant.</p>
                    ) : (
                      <ul className="list-disc list-inside ml-4">
                        {selectedMerchant.items?.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.name} - {item.currency} {item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
    </React.Fragment>
  );
};
    </div>
    </React.Fragment>
  );
};

export default MerchantSection;
