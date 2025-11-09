import React, { useState } from 'react';
import { Buyer, Merchant, Item } from '@/types/global';

interface BuyerSectionProps {
  buyers: Buyer[];
  merchants: Merchant[];
  addBuyer: (buyer: Buyer) => void;
}

const BuyerSection: React.FC<BuyerSectionProps> = ({ buyers, merchants, addBuyer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'browseItems' | 'existingBuyers'>('browseItems');
  const [selectedItem, setSelectedItem] = useState<{ item: Item; merchant: Merchant } | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Buyer form state
  const [buyerFirstName, setBuyerFirstName] = useState('');
  const [buyerLastName, setBuyerLastName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  // Get all items from all merchants
  const getAllItems = () => {
    const items: { item: Item; merchant: Merchant }[] = [];
    merchants.forEach((merchant) => {
      merchant.items.forEach((item) => {
        items.push({ item, merchant });
      });
    });
    return items;
  };

  const handleBuyClick = (itemWithMerchant: { item: Item; merchant: Merchant }) => {
    setSelectedItem(itemWithMerchant);
    setShowPaymentForm(true);
  };

  const handleCreateBuyerAndPurchase = async () => {
    if (!buyerFirstName || !buyerLastName || !buyerEmail || !selectedItem) {
      alert('Please fill in all buyer information');
      return;
    }

    // Create new buyer identity
    const newBuyer: Buyer = {
      id: `buyer-${Date.now()}`,
      firstName: buyerFirstName,
      lastName: buyerLastName,
      email: buyerEmail,
    };

    // Add buyer to the system
    addBuyer(newBuyer);

    // TODO: Here we would integrate with the payment system to:
    // 1. Create buyer identity in Finix
    // 2. Collect payment information
    // 3. Create payment instrument
    // 4. Create transfer

    alert(`Purchase initiated!\n\nBuyer: ${newBuyer.firstName} ${newBuyer.lastName}\nItem: ${selectedItem.item.name}\nPrice: ${selectedItem.item.currency} ${selectedItem.item.price.toFixed(2)}\nMerchant: ${selectedItem.merchant.name}`);

    // Reset form
    setBuyerFirstName('');
    setBuyerLastName('');
    setBuyerEmail('');
    setShowPaymentForm(false);
    setSelectedItem(null);
  };

  const allItems = getAllItems();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Buyer Section</h2>

      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 text-lg ${activeSubTab === 'browseItems' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveSubTab('browseItems')}
        >
          Browse Items
        </button>
        <button
          className={`py-2 px-4 text-lg ${activeSubTab === 'existingBuyers' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveSubTab('existingBuyers')}
        >
          Existing Buyers
        </button>
      </div>

      {activeSubTab === 'browseItems' && (
        <div>
          <h3 className="text-xl font-medium mb-4">Available Items</h3>
          {allItems.length === 0 ? (
            <p className="text-gray-600">No items available for purchase. Merchants need to create items first.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allItems.map(({ item, merchant }) => (
                <div key={`${merchant.id}-${item.id}`} className="p-4 border rounded-md shadow-sm hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold mb-2">{item.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {item.currency} {item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Sold by: {merchant.name}
                  </p>
                  <button
                    onClick={() => handleBuyClick({ item, merchant })}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Payment Form Modal */}
          {showPaymentForm && selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4">Complete Your Purchase</h3>
                
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <p className="font-medium">{selectedItem.item.name}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedItem.item.currency} {selectedItem.item.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Merchant: {selectedItem.merchant.name}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Buyer Information</h4>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={buyerFirstName}
                    onChange={(e) => setBuyerFirstName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={buyerLastName}
                    onChange={(e) => setBuyerLastName(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCreateBuyerAndPurchase}
                      className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Proceed to Payment
                    </button>
                    <button
                      onClick={() => {
                        setShowPaymentForm(false);
                        setSelectedItem(null);
                      }}
                      className="flex-1 py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'existingBuyers' && (
        <div>
          <h3 className="text-xl font-medium mb-4">Existing Buyers</h3>
          {buyers.length === 0 ? (
            <p className="text-gray-600">No buyers have made purchases yet.</p>
          ) : (
            <div className="space-y-4">
              {buyers.map((buyer) => (
                <div key={buyer.id} className="p-4 border rounded-md shadow-sm">
                  <h3 className="text-xl font-medium">{buyer.firstName} {buyer.lastName}</h3>
                  <p>Email: {buyer.email}</p>
                  <p className="text-sm text-gray-600">ID: {buyer.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerSection;
