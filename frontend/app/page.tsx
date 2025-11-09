"use client";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import BuyerSection from "./components/BuyerSection";
import MerchantSection from "./components/MerchantSection";
import { Buyer, Merchant, Item } from "@/types/global";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"buyer" | "merchant">("buyer");
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const addBuyer = (buyer: Buyer) => {
    setBuyers((prevBuyers) => [...prevBuyers, buyer]);
  };

  const addMerchant = (merchant: Merchant) => {
    setMerchants((prevMerchants) => [...prevMerchants, merchant]);
  };

  const addItemToMerchant = (merchantId: string, item: Item) => {
    setMerchants((prevMerchants) =>
      prevMerchants.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, items: [...merchant.items, item] }
          : merchant
      )
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto py-8 px-4">
        {activeTab === "buyer" && (
          <BuyerSection
            buyers={buyers}
            addBuyer={addBuyer}
            merchants={merchants}
          />
        )}
        {activeTab === "merchant" && (
          <MerchantSection
            merchants={merchants}
            addMerchant={addMerchant}
            addItemToMerchant={addItemToMerchant}
          />
        )}
      </main>
    </div>
  );
}
