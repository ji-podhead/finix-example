import React, { FC } from 'react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'buyer' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => onTabChange('buyer')}
          >
            Buyer
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'merchant' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => onTabChange('merchant')}
          >
            Merchant
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
