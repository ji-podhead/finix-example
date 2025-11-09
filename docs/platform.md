Step 1: Collect Information and Consent

To board sellers directly via API, Finix requires you that you:

    Collect your sellers' business, ownership, processing, and bank account information
    Present language to your sellers that their information will be verified
    Present both Finix's and your own terms of service to your sellers
    Present your payment processing fees to your sellers

Collecting Information

Finix requires you collect the following information about your sellers:

    Business information: Finix collects data about your seller's business, such as their business name
    Owner information: Finix collects data about your seller's control person, such as their personal name
    Processing information: Finix collects data about your seller's processing information, such as volumes
    Bank account information: Finix collects details about your seller's bank account for their payouts

See Onboarding Data and Identities for the full list of required fields and data formats.
Collecting Bank Account Information

When collecting bank account information, you must use the following language to communicate to your sellers that the bank account provided should only be used for business purposes:

You agree to use this bank account for legitimate business purposes, and not for personal, family, or household purposes.

Verification Consent

You must present your sellers with language informing them that they are applying for payment processing services, and that their identity will be verified. Please add the following text at the beginning of your onboarding process:

The information you provide will be used to verify your identity. Additional information may be requested.

Terms of Service

You must present both Finix's and your own terms of service to your sellers, which your sellers must explicitly consent to via click-through agreement. Please add the following text to your onboarding process, which should hyperlink to both Finix's and your own terms of service:

By continuing, you agree to our Terms of Service and the Finix Terms of Service.

The Finix Terms of Service version you link to varies by your seller's business country and payment processor:
Country	Processor	ToS Version
United States (USA)	FINIX_V1	Link
United States (USA)	LITLE_V1	Link
United States (USA)	VANTIV_V1	Link
Canada (CAN)	FINIX_V1	Link

Finix will collect information about your seller's consent on the Identity resource in the next step.
Presenting Fees

You must present your payment processing fees to your sellers clearly and prominently in your onboarding process. In addition, you must communicate fee changes to your sellers with prior notice.
Step 2: Create an Identity

After the previous step is complete, you are ready to create an Identity for your seller. The Identity holds the business, personal, processing, and consent information from your seller, which Finix underwrites during the review process. Each Identity can hold one person's information; should your seller's business have one or more beneficial owners with 25% or more ownership, you must create an Associated Identity for each beneficial owner.

See Onboarding Data and Identities for the full list of required fields and data formats.

Request

curl -X POST \
    -u USsRhsHYZGBPnQw8CByJyEQW:8a14c2f9-d94b-4c72-8f5c-a62908e5b30e \
    https://finix.sandbox-payments-api.com/identities \
    -H 'Accept: application/hal+json' \
    -H 'Content-Type: application/json' \
    -H 'Finix-Version: 2022-02-01' \
    -d '{
        "additional_underwriting_data": {
            "annual_ach_volume": 200000,
            "average_ach_transfer_amount": 200000,
            "average_card_transfer_amount": 200000,
            "business_description": "SB3 vegan cafe",
            "card_volume_distribution": {
                "card_present_percentage": 30,
                "mail_order_telephone_order_percentage": 10,
                "ecommerce_percentage": 60
            },
            "credit_check_allowed": true,
            "credit_check_ip_address": "42.1.1.112",
            "credit_check_timestamp": "2021-04-28T16:42:55Z",
            "credit_check_user_agent": "Mozilla 5.0(Macintosh; IntelMac OS X 10 _14_6)",
            "merchant_agreement_accepted": true,
            "merchant_agreement_ip_address": "42.1.1.113",
            "merchant_agreement_timestamp": "2021-04-28T16:42:55Z",
            "merchant_agreement_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6)",
            "refund_policy": "MERCHANDISE_EXCHANGE_ONLY",
            "volume_distribution_by_business_type": {
                "other_volume_percentage": 0,
                "consumer_to_consumer_volume_percentage": 0,
                "business_to_consumer_volume_percentage": 0,
                "business_to_business_volume_percentage": 100,
                "person_to_person_volume_percentage": 0
            }
        },
        "entity": {
            "annual_card_volume": 12000000,
            "business_address": {
                "city": "San Mateo",
                "country": "USA",
                "region": "CA",
                "line2": "Apartment 8",
                "line1": "741 Douglass St",
                "postal_code": "94114"
            },
            "business_name": "Finix Flowers",
            "business_phone": "+1 (408) 756-4497",
            "business_tax_id": "123456789",
            "business_type": "INDIVIDUAL_SOLE_PROPRIETORSHIP",
            "default_statement_descriptor": "Finix Flowers",
            "dob": {
                "year": 1978,
                "day": 27,
                "month": 6
            },
            "doing_business_as": "Finix Flowers",
            "email": "user@example.org",
            "first_name": "John",
            "has_accepted_credit_cards_previously": true,
            "incorporation_date": {
                "year": 1978,
                "day": 27,
                "month": 6
            },
            "last_name": "Smith",
            "max_transaction_amount": 1200000,
            "ach_max_transaction_amount": 1000000,
            "mcc": "4900",
            "ownership_type": "PRIVATE",
            "personal_address": {
                "city": "San Mateo",
                "country": "USA",
                "region": "CA",
                "line2": "Apartment 7",
                "line1": "741 Douglass St",
                "postal_code": "94114"
            },
            "phone": "14158885080",
            "principal_percentage_ownership": 50,
            "tax_id": "123456789",
            "title": "CEO",
            "url": "https://www.finix.com"
        },
        "identity_roles": ["SELLER"],
        "tags": {
            "Studio Rating": "4.7"
        },
        "type": "BUSINESS"
    }'

Response

{
    "id": "IDfbYwPeMVE2dVWbGuuZxMyD",
    "created_at": "2024-08-15T21:25:53.55Z",
    "updated_at": "2024-08-15T21:25:53.55Z",
    "additional_underwriting_data": {
        "refund_policy": "MERCHANDISE_EXCHANGE_ONLY",
        "credit_check_ip_address": "42.1.1.112",
        "card_volume_distribution": {
            "card_present_percentage": 30,
            "mail_order_telephone_order_percentage": 10,
            "ecommerce_percentage": 60
        },
        "average_ach_transfer_amount": 200000,
        "average_card_transfer_amount": 200000,
        "merchant_agreement_accepted": true,
        "merchant_agreement_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6)",
        "merchant_agreement_ip_address": "42.1.1.113",
        "annual_ach_volume": 200000,
        "credit_check_allowed": true,
        "business_description": "SB3 vegan cafe",
        "credit_check_user_agent": "Mozilla 5.0(Macintosh; IntelMac OS X 10 _14_6)",
        "volume_distribution_by_business_type": {
            "other_volume_percentage": 0,
            "consumer_to_consumer_volume_percentage": 0,
            "business_to_consumer_volume_percentage": 0,
            "business_to_business_volume_percentage": 100,
            "person_to_person_volume_percentage": 0
        },
        "credit_check_timestamp": "2021-04-28T16:42:55Z",
        "merchant_agreement_timestamp": "2021-04-28T16:42:55Z"
    },
    "application": "APgPDQrLD52TYvqazjHJJchM",
    "entity": {
        "ach_max_transaction_amount": 1000000,
        "amex_mid": null,
        "annual_card_volume": 12000000,
        "business_address": {
            "line1": "741 Douglass St",
            "line2": "Apartment 8",
            "city": "San Mateo",
            "region": "CA",
            "postal_code": "94114",
            "country": "USA"
        },
        "business_name": "Finix Flowers",
        "business_phone": "+1 (408) 756-4497",
        "business_tax_id_provided": true,
        "business_type": "INDIVIDUAL_SOLE_PROPRIETORSHIP",
        "default_statement_descriptor": "Finix Flowers",
        "discover_mid": null,
        "dob": {
            "day": 27,
            "month": 6,
            "year": 1978
        },
        "doing_business_as": "Finix Flowers",
        "email": "user@example.org",
        "first_name": "John",
        "has_accepted_credit_cards_previously": true,
        "incorporation_date": {
            "day": 27,
            "month": 6,
            "year": 1978
        },
        "last_name": "Smith",
        "max_transaction_amount": 1200000,
        "mcc": "4900",
        "ownership_type": "PRIVATE",
        "personal_address": {
            "line1": "741 Douglass St",
            "line2": "Apartment 7",
            "city": "San Mateo",
            "region": "CA",
            "postal_code": "94114",
            "country": "USA"
        },
        "phone": "14158885080",
        "principal_percentage_ownership": 50,
        "short_business_name": null,
        "tax_authority": null,
        "tax_id_provided": true,
        "title": "CEO",
        "url": "https://www.finix.com"
    },
    "identity_roles": ["SELLER"],
    "tags": {
        "Studio Rating": "4.7"
    },
    "type": "BUSINESS",
    "_links": {
        "self": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD"
        },
        "verifications": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/verifications"
        },
        "merchants": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/merchants"
        },
        "settlements": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/settlements"
        },
        "authorizations": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/authorizations"
        },
        "transfers": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/transfers"
        },
        "payment_instruments": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/payment_instruments"
        },
        "associated_identities": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/associated_identities"
        },
        "disputes": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/disputes"
        },
        "application": {
            "href": "https://finix.sandbox-payments-api.com/applications/APgPDQrLD52TYvqazjHJJchM"
        }
    }
}

Step 3: Add a Bank Account

Next, you're ready to link your seller's bank account to their Identity with the Payment Instruments API. This is the bank account to which your seller will receive payouts, and is reviewed during Finix's seller underwriting process. Note that step is required for the next step's request (creating your seller's Merchant) to succeed.

You can create the Payment Instrument with your seller's bank account information directly. Alternatively, you can create the Payment Instrument using a Plaid Processor Token (see our Plaid guide for additional context).

Request

curl -X POST \
    -u USsRhsHYZGBPnQw8CByJyEQW:8a14c2f9-d94b-4c72-8f5c-a62908e5b30e \
    https://finix.sandbox-payments-api.com/payment_instruments \
    -H 'Accept: application/hal+json' \
    -H 'Content-Type: application/json' \
    -H 'Finix-Version: 2022-02-01' \
    -d '{
        "account_number": "0000000019",
        "account_type": "BUSINESS_CHECKING",
        "bank_code": "122105278",
        "identity": "IDfbYwPeMVE2dVWbGuuZxMyD",
        "name": "Smith & Associates Consulting",
        "type": "BANK_ACCOUNT"
    }'

Response

{
    "id": "PI3dGTEWFHC8XHZrqpHBHpHc",
    "created_at": "2024-08-16T12:23:02.94Z",
    "updated_at": "2024-08-16T12:23:02.94Z",
    "application": "APgPDQrLD52TYvqazjHJJchM",
    "created_via": "API",
    "currency": "USD",
    "disabled_code": null,
    "disabled_message": null,
    "enabled": true,
    "fingerprint": "FPRxpMNPZbZqVQfcHzRUJnzkR",
    "identity": "IDfbYwPeMVE2dVWbGuuZxMyD",
    "instrument_type": "BANK_ACCOUNT",
    "account_type": "BUSINESS_CHECKING",
    "bank_account_validation_check": "NOT_ATTEMPTED",
    "bank_code": "122105278",
    "country": "USA",
    "institution_number": null,
    "masked_account_number": "XXXXXX0019",
    "name": "Smith & Associates Consulting",
    "transit_number": null,
    "tags": {},
    "third_party": null,
    "third_party_token": null,
    "type": "BANK_ACCOUNT",
    "_links": {
        "self": {
            "href": "https://finix.sandbox-payments-api.com/payment_instruments/PI3dGTEWFHC8XHZrqpHBHpHc"
        },
        "authorizations": {
            "href": "https://finix.sandbox-payments-api.com/payment_instruments/PI3dGTEWFHC8XHZrqpHBHpHc/authorizations"
        },
        "transfers": {
            "href": "https://finix.sandbox-payments-api.com/payment_instruments/PI3dGTEWFHC8XHZrqpHBHpHc/transfers"
        },
        "verifications": {
            "href": "https://finix.sandbox-payments-api.com/payment_instruments/PI3dGTEWFHC8XHZrqpHBHpHc/verifications"
        },
        "application": {
            "href": "https://finix.sandbox-payments-api.com/applications/APgPDQrLD52TYvqazjHJJchM"
        },
        "identity": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD"
        }
    }
}

Step 4: Create a Merchant

With your seller's Identity and Payment Instrument created, you are ready to create your seller's Merchant. This step creates the Merchant account that your seller will use to process payments once approved. When you create the Merchant account, Finix automatically creates a Verification on the Merchant, which puts the Merchant into Finix's underwriting process. Each Merchant can use one payments processor; should your seller need multiple processors, you may create one Merchant per processor.

Request

curl -X POST \
    -u USsRhsHYZGBPnQw8CByJyEQW:8a14c2f9-d94b-4c72-8f5c-a62908e5b30e \
    https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD/merchants \
    -H 'Accept: application/hal+json' \
    -H 'Content-Type: application/json' \
    -H 'Finix-Version: 2022-02-01' \
    -d '{
        "processor": "DUMMY_V1"
    }'

Response

{
    "id": "MUa2uYEkaRBzP8EEDeKweE5h",
    "created_at": "2024-08-16T12:23:30.79Z",
    "updated_at": "2024-08-16T12:23:30.79Z",
    "application": "APgPDQrLD52TYvqazjHJJchM",
    "card_cvv_required": false,
    "card_expiration_date_required": true,
    "card_network_details": null,
    "convenience_charges_enabled": false,
    "country": "USA",
    "creating_transfer_from_report_enabled": true,
    "currencies": ["USD"],
    "default_partial_authorization_enabled": false,
    "disbursements_ach_pull_enabled": false,
    "disbursements_ach_push_enabled": false,
    "disbursements_card_pull_enabled": false,
    "disbursements_card_push_enabled": false,
    "disbursements_same_day_ach_pull_enabled": false,
    "disbursements_same_day_ach_push_enabled": false,
    "fee_ready_to_settle_upon": "RECONCILIATION",
    "gateway": null,
    "gross_settlement_enabled": false,
    "identity": "IDfbYwPeMVE2dVWbGuuZxMyD",
    "level_two_level_three_data_enabled": false,
    "loan_repayment": null,
    "mcc": "4900",
    "merchant_name": "Finix Flowers",
    "merchant_profile": "MP7vh4DGaBW9eCKq1kFiJaP4",
    "mid": null,
    "onboarding_state": "PROVISIONING",
    "processing_enabled": false,
    "processor": "DUMMY_V1",
    "processor_details": {},
    "ready_to_settle_upon": "RECONCILIATION",
    "ready_to_settle_upon_delay_alignment": "NONE",
    "rent_surcharges_enabled": false,
    "settlement_enabled": false,
    "settlement_funding_identifier": "UNSET",
    "surcharges_enabled": false,
    "tags": {},
    "verification": "VIrnen8yHQZTQnc4EYA8NL8W",
    "_links": {
        "self": {
            "href": "https://finix.sandbox-payments-api.com/merchants/MUa2uYEkaRBzP8EEDeKweE5h"
        },
        "identity": {
            "href": "https://finix.sandbox-payments-api.com/identities/IDfbYwPeMVE2dVWbGuuZxMyD"
        },
        "verifications": {
            "href": "https://finix.sandbox-payments-api.com/merchants/MUa2uYEkaRBzP8EEDeKweE5h/verifications"
        },
        "merchant_profile": {
            "href": "https://finix.sandbox-payments-api.com/merchant_profiles/MP7vh4DGaBW9eCKq1kFiJaP4"
        },
        "application": {
            "href": "https://finix.sandbox-payments-api.com/applications/APgPDQrLD52TYvqazjHJJchM"
        },
        "verification": {
            "href": "https://finix.sandbox-payments-api.com/verifications/VIrnen8yHQZTQnc4EYA8NL8W"
        }
    }
}

Step 5: Review Process

Your seller will be ready to process payments once their Merchant account is APPROVED. Finix will update the Merchant's onboarding_state after the review process, which often takes just minutes but can take longer if manual intervention is required.
Receiving Webhooks

Finix sends webhooks to update you about your seller's progress throughout the onboarding process. For example, you can listen to the Merchant Updated and Merchant Underwritten events to know when your Merchant transitions from PROVISIONING to another state.

To learn more about webhooks, see Notifications and Webhooks.
Handling Update Requests

Should Finix require additional information to board your seller, we will move their Merchant to an UPDATE_REQUESTED state and explain what additional information is required. Finix provides codes for each information request type, making it easy to build your own experience to manage update requests.

To learn more about handling update requests, see Handling Update Requests.