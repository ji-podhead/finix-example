# Finix Sandbox Backend

This is the backend for the Finix API Sandbox. It provides a simple API for creating merchants, buyers, items, and payments.

## API Endpoints

### Merchants

*   `POST /create_merchant`: Creates a new merchant.
*   `GET /merchants`: Retrieves a list of all merchants.
*   `POST /create-merchant-identity`: Creates a new merchant identity.

### Buyers

*   `POST /create-buyer`: Creates a new buyer.
*   `GET /identities`: Retrieves a list of all identities.

### Items

*   `POST /merchants/:merchantId/items`: Creates a new item for a merchant.
*   `GET /merchants/:merchantId/items`: Retrieves a list of all items for a merchant.

### Payments

*   `POST /create-payment-instrument`: Creates a new payment instrument.
*   `POST /create-transfer`: Creates a new transfer (a payment).

## Flows

### Merchant Flow

1.  Create a merchant identity by sending a `POST` request to `/create-merchant-identity`.
2.  Create a merchant by sending a `POST` request to `/create_merchant`.
3.  Create a payment instrument by sending a `POST` request to `/create-payment-instrument`.

### Buyer Flow

1.  Create a buyer by sending a `POST` request to `/create-buyer`.

### Item Management

1.  Create an item for a merchant by sending a `POST` request to `/merchants/:merchantId/items`.
2.  Retrieve a list of items for a merchant by sending a `GET` request to `/merchants/:merchantId/items`.

### Purchase Flow

1.  Create a buyer.
2.  Create a payment instrument for the buyer.
3.  Create a transfer by sending a `POST` request to `/create-transfer`.
