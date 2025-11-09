# Onboarding Flow for Merchant Creation

This document outlines the process for creating merchants within our Finix integration.

## 1. Identity Creation (Frontend)

- The user initiates the process by filling out an identity form in the frontend.
- This form collects necessary details for creating a Finix Identity.
- Upon submission, the frontend sends this data to the backend.

## 2. Identity Creation (Backend & Finix API)

- The backend receives the identity data from the frontend.
- The backend then makes a POST request to the Finix API (`/identities`) to create the identity.
- The Finix API requires specific entity details, including business information, contact details, and address.

## 3. Storing Identity in MongoDB

- Upon successful creation of an identity by the Finix API, the response, which includes the identity ID, is received by the backend.
- The backend then stores this identity information in MongoDB, using the `id` field from the Finix API response as the primary index.

## 4. Merchant Creation (Frontend & Backend)

- After identity creation, the user proceeds to create a merchant, also through the frontend.
- The frontend sends merchant details, including the previously created identity ID, to the backend.
- The backend uses this identity ID to create the merchant via the Finix API (`/identities/{identityId}/merchants`).

## 5. Storing Merchant in MongoDB

- Once the merchant is successfully created via the Finix API, the response containing the merchant details (including its ID) is stored in MongoDB.

## 6. Payment Instrument Creation (Frontend & Backend)

- Within the "Create Merchant" section in the frontend, there will be an option to create payment instruments.
- This involves collecting payment instrument details (e.g., card token, type) and associating them with the merchant's identity.
- The frontend sends this data to a new backend endpoint.

## 7. Storing Payment Instrument in MongoDB

- The backend receives payment instrument data, creates the instrument via the Finix API, and stores the response in MongoDB.

## Important Notes:

- **Environment Variables:** Ensure that `FINIX_API_USERNAME` and `FINIX_API_PASSWORD` are correctly set in the `.env` file. The `FINIX_IDENTITY_ID` is not an environment variable and will be managed by the application.
- **Error Handling:** Robust error handling should be implemented at each step to manage API failures or data inconsistencies.
- **Data Persistence:** MongoDB is used for storing all created Finix entities (Identities, Merchants, Payment Instruments) to maintain application state.
