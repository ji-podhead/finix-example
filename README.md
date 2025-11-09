# Finix API Sandbox

This project is a demonstration sandbox for the Finix API, designed to simulate the Finix Sandbox Certification Steps. It provides a user interface to trigger various API events and view mock responses, helping developers understand and test the integration process.

## Features

- Simulate creating identities and authorizing payments.
- Mock successful and failed transaction scenarios.
- Demonstrate the passing of Fraud Session IDs and Idempotency IDs.
- Includes a mock tokenization form.
- Simulates dispute and refund flows.

## How to Use

1. Open `index.html` in your web browser.
2. Use the buttons and controls to simulate different API calls.
3. Observe the mock API responses in the output area.

## Payment Flow (Based on the Quickstart Guide)

This sandbox now simulates the official three-step process for processing a payment via the Finix API.

### Step 1: Create a Buyer (`Identity`)

The first step is to create an `Identity` to represent your buyer. This resource stores the buyer's personal data and is used to manage their payment methods and transactions. While all fields are optional, providing basic information is recommended.

**API Request:** `POST /identities`
```json
{
  "entity": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "tags": {
    "customer_id": "cust_123"
  }
}
```

### Step 2: Create a Payment Instrument

Next, you create a `Payment Instrument` which represents the buyer's payment method (e.g., a credit card). This is done using a secure `token` obtained from one of Finix's client-side tokenization solutions. The `Payment Instrument` must be associated with the buyer's `Identity` from Step 1.

**API Request:** `POST /payment_instruments`
```json
{
  "identity": "IDxxxxxxxxxxxxxxxxxx",
  "token": "TKNxxxxxxxxxxxxxxxxxx",
  "type": "TOKEN",
  "tags": {
    "source": "web_checkout"
  }
}
```

### Step 3: Create a Transfer

Finally, you create a `Transfer` to charge the buyer. The `Transfer` uses the `Payment Instrument` ID as its `source` and requires a `merchant` ID to process the transaction. This is also where you would include a `fraud_session_id` and an `idempotency_id`.

**API Request:** `POST /transfers`
```json
{
  "source": "PIxxxxxxxxxxxxxxxxxx",
  "merchant": "MUxxxxxxxxxxxxxxxxxxxxxxx",
  "amount": 10000,
  "currency": "USD",
  "fraud_session_id": "FSxxxxxxxxxxxxxxxxxx",
  "idempotency_id": "idem_xxxxxxxxxxxxxxxxx"
}
```

---

## Running the Finix Demo Project (in the `/demo` folder)

The included demo project is a full-stack Next.js application that shows a more complete integration. To run it:

1.  **Navigate to the demo directory:**
    ```bash
    cd demo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Integrating Google Pay and Apple Pay

In the demo project, Google Pay and Apple Pay are integrated by loading their respective JavaScript SDKs globally in `official-finix-example-project/src/app/layout.tsx`. This makes the `google` and `ApplePaySession` objects available throughout the client-side application without explicit imports in individual components.

*   **Google Pay**: The Google Pay JavaScript SDK is loaded via `<Script src="https://pay.google.com/gp/p/js/pay.js" strategy="afterInteractive" />`. This script exposes the global `google.payments.api` object.
*   **Apple Pay**: The Apple Pay JS SDK is loaded via `<Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="afterInteractive" />`. This script exposes the global `ApplePaySession` object.

TypeScript recognizes these global objects through ambient type declarations, which are typically provided by `@types` packages or included within the libraries themselves.

### Testing Webhooks Locally with ngrok

You do not need a VM or VPN to test webhooks. A tool like `ngrok` can expose your local server to the internet.

1.  **Install ngrok:** Follow the instructions on the [ngrok website](https://ngrok.com/download).

2.  **Start your local server:** Run `npm run dev` in the `demo` directory. It will run on a port, typically `3000`.

3.  **Start ngrok:** Open a *new terminal window* and run the following command to create a tunnel to your local server\'s port:
    ```bash
    ngrok http 3000
    ```

4.  **Get your public URL:** ngrok will give you a public "Forwarding" URL that looks something like `https://<random-string>.ngrok.io`.

5.  **Configure the webhook in Finix:** In your Finix Dashboard, go to the webhooks section and create a new webhook endpoint. Paste the public URL from ngrok into the URL field. Now, when events happen in your Finix sandbox account, they will be sent to your local application.

### Alternative for Webhook Testing: Tailscale Funnel

If you use [Tailscale](https://tailscale.com/), you can use its "Funnel" feature as an alternative to ngrok.

1.  **Install and configure Tailscale:** Make sure Tailscale is installed and running on your machine.

2.  **Start your local server:** Run `npm run dev` in the `demo` directory to start the application on port `3000`.

3.  **Enable the Funnel:** Open a terminal and run the following command:
    ```bash
    tailscale funnel 3000
    ```

4.  **Get your public URL:** Tailscale will provide a public URL for your machine (e.g., `https://your-machine-name.ts.net`). This is the URL you can use in the Finix Dashboard for your webhook endpoint. The advantage is that this URL is stable and tied to your machine\'s name.

---

## Understanding the Webhook Flow

A common point of confusion is whether a separate server is needed for webhooks. The answer is no. Your existing web server (the one running the Next.js demo) can handle webhook requests.

The flow works like this:

1.  An event occurs in Finix (e.g., a payout is completed).
2.  Finix\'s server sends an HTTP POST request to the public URL you provided.
3.  `ngrok` or `Tailscale Funnel` receives this request and securely forwards it to your local machine on the port you specified (e.g., `localhost:3000`).
4.  Your Next.js application receives the request at the specified path (e.g., `/api/webhooks`). You would create a new API route file at `demo/src/app/api/webhooks/route.ts` to handle this logic.
5.  Your code in that file then processes the event, for example, by updating a database or sending a notification.

### Webhook Flow Diagram

Here is a simple diagram illustrating the process:

```
+-----------------+      2. POST Request      +-----------------+      3. Forward Request      +----------------------+
|                 |-------------------------->|     ngrok /     |---------------------------->|                      |
|  Finix Servers  |      (to Public URL)      | Tailscale Funnel|      (to localhost:3000)     | Your Next.js Server  |
|                 |                           |                 |                              | (Handles API Routes) |
+-----------------+                           +-----------------+                              +----------------------+
        ^                                                                                                |
        | 1. Event Occurs                                                                                | 4. Process Webhook
        | (e.g., Payout SUCCEEDED)                                                                       | (e.g., Update DB)
        |                                                                                                v
                                                                                                +----------------------+
                                                                                                | Your Application\'s   |
                                                                                                |      Database        |
                                                                                                +----------------------+
```

---

## New Frontend/Backend Application

This repository also includes a new full-stack application in the `frontend` and `backend` directories that demonstrates a complete marketplace flow with merchant and buyer interactions.

### Getting Started

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend server will run on `http://localhost:3001`.

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend application will run on `http://localhost:3000`.

### Application Flow

#### Merchant Section

The merchant section allows merchants to:

1. **Create Items/Payment Links**: Merchants should create items (products) with payment links in the merchant section. Each item represents a product or service that can be purchased.
   
2. **Manage Inventory**: Merchants can view and manage their created items.

3. **Track Sales**: Monitor transactions and sales for their items.

#### Buyer Section

The buyer section provides the following flow:

1. **Browse Items**: Buyers can browse all available items created by merchants.

2. **Select Items**: Buyers can select items they want to purchase. These are the payment links created by merchants in the merchant section.

3. **Purchase Flow**:
   - When a buyer clicks the "Buy" button on an item:
     - A new buyer `Identity` is created in the Finix system
     - The buyer's payment information is collected
     - A `Payment Instrument` is created and associated with the buyer
     - A `Transfer` is initiated to complete the purchase

4. **Transaction Completion**: After successful payment, the buyer receives confirmation and the merchant is notified of the sale.

### Technical Implementation

The application uses:
- **Frontend**: Next.js with TypeScript
- **Backend**: Node.js with Express
- **Payment Processing**: Finix API
- **Real-time Updates**: WebSockets for live transaction status

### Environment Variables

Make sure to set up your `.env` file with:
```
FINIX_USERNAME=your_username
FINIX_PASSWORD=your_password
FINIX_MERCHANT_ID=your_merchant_id
```
