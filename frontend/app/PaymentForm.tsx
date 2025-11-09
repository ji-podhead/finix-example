import React, { useEffect, useRef, useState } from "react";
import { FinixForm, FormState, BinInformation } from "@/types/global";

declare global {
  interface Window {
    Finix: any; // Declare Finix on the Window object
  }
}

interface PaymentFormProps {
  buyerId: string;
  merchantId: string;
  amount: number;
  currency: string;
  onPaymentSuccess: (data: any) => void;
  onPaymentError: (error: Error) => void;
}

export default function PaymentForm({
  buyerId,
  merchantId,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}: PaymentFormProps) {
  const finixForm = useRef<FinixForm | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { Finix } = window as any;

    if (Finix && !finixForm.current) {
      const options = {
        showAddress: true,
        requiredFields: ["address_line1", "city", "state", "postal_code"],
        onUpdate: (state: FormState, binInformation: BinInformation, hasErrors: boolean) => {
          setIsFormValid(!hasErrors);
        },
        styles: {
          default: {
            border: "1px solid #d1d5dc",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.25rem",
            color: "#091e42",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 0 rgba(9,30,66,.08)",
          },
        },
      };

      finixForm.current = Finix.CardTokenForm("payment-form", options);
    }
  }, []);

  const handleTokenReceived = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3001/create-transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          amount,
          currency,
          source: token, // The token from FinixForm is the source
          merchant: merchantId,
          identity: buyerId, // Pass the buyerId to the backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment processing failed");
      }

      const data = await response.json();
      onPaymentSuccess(data);
    } catch (err: any) {
      onPaymentError(err instanceof Error ? err : new Error(err.message || "Payment processing failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      const token = await new Promise((resolve, reject) => {
        finixForm.current?.submit("sandbox", "APc9vhYcPsRuTSpKD9KpMtPe", function (err: any, res: any) {
          if (err) reject(err);
          else resolve(res.data.id);
        });
      });

      handleTokenReceived(token as string);
    } catch (err: any) {
      setIsProcessing(false);
      setError("Tokenization failed: " + (err as Error).message);
      onPaymentError(err instanceof Error ? err : new Error(err.message || "Tokenization failed"));
    }
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">Card Payment</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}
      <div id="payment-form" />
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !isFormValid}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isProcessing || !isFormValid ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800`}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </div>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
}
