"use client";

import { useCallback } from "react";
import GooglePayButtonReact from "@google-pay/button-react";
// import { useCart } from "../official-finix-example-project/src/app/context/CartContext";
// import { googlePayButtonCode } from "./inspector/code/GooglePayButtonCode";

interface GooglePayButtonProps {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: Error) => void;
  disabled?: boolean;
}

export default function GooglePayButton({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}: GooglePayButtonProps) {
  const total = amount;

  const handlePaymentAuthorized = useCallback((paymentData: google.payments.api.PaymentData) => {
    try {
      onPaymentSuccess(paymentData);
    } catch (error: any) {
      console.error("Payment processing error:", error);
      onPaymentError(error instanceof Error ? error : new Error(error.message || "Payment processing failed"));
    }
  }, [onPaymentSuccess, onPaymentError]);

  const handleError = useCallback((error: Error | google.payments.api.PaymentsError) => {
    console.error("Google Pay error:", error);
    onPaymentError(error as Error);
  }, [onPaymentError]);

  return (
    <div className="w-full m-auto">
      <div className="w-full">
        <GooglePayButtonReact
          environment="TEST"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX", "DISCOVER"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "finix",
                    gatewayMerchantId: "ID12345", // Identity ID from Finix
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: "GOOGMERCHID", // Merchant ID from Google
              merchantName: "Finix Store",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPrice: total.toString(),
              currencyCode: currency,
            },
          }}
          onLoadPaymentData={handlePaymentAuthorized}
          onError={handleError}
          existingPaymentMethodRequired={false}
          style={{ width: 250, height: 45 }}
          buttonSizeMode="fill"
        />
      </div>
    </div>
  );
}
