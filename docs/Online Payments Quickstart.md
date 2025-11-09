## Online Payments Quickstart

This guide explains how to get started with online payments. Finix offers multiple integration options for accepting payments online, including via API or our low-code / no-code solutions.

Your buyers can make payments with their cards or bank accounts, which Finix lets you collect and store securely with our tokenization forms / SDKs, as well as our digital wallet and Plaid integrations. In addition, Finix offers many features for customizing your payments flow and managing risk.

To learn about in-person payments, read our [In-Person Payments guide](https://docs.finix.com/guides/in-person-payments).

---

## Making Payments via API

Customers that want the most flexibility for their online payments needs can use our APIs to build out their own payments flows. This option works well for customers that want to integrate payment acceptance into their website or app, and have developer resources to build that integration.

### Step 1: Create a Buyer

First, create an Identity to represent your buyer. The Identity resource represents both buyers and sellers. If you're a platform managing multiple sellers, see our [Platform Payments guide](https://docs.finix.com/guides/platform-payments) to learn how to onboard sellers.

Your buyer's Identity stores their personal data (such as name and email), and helps manage their payments, payment methods, identity verification, and more.

Buyer Identity Data

All buyer Identity fields are optional. However, Finix recommends including basic information (name, email, address, and phone) to make payment operations easier.

#### Request

entity *object* required

The underwriting details required to verify `Identities`.

entity.email *string*

The email address of the buyer where they can be reached (max 100 characters).

entity.first\_name *string*

The legal first name of the buyer (max 20 characters).

entity.last\_name *string*

The legal last name of the buyer (max 20 characters).

entity.personal\_address *object*

The billing address of the buyer. This field is used for identity verification purposes.

entity.phone *string*

Phone number where the buyer can be reached.

identity\_roles *Array of strings*

The sets of permissions available to the `Identity`.

ItemsValue "BUYER"

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

type *string*

The `Identity` type.

Enum "PERSONAL" "BUSINESS"

#### Response

id *string* *(id)* *non-empty*

The ID of the resource.

created\_at *string* *(date-time)* *(created\_at)*

Timestamp of when the object was created.

updated\_at *string* *(date-time)* *(updated\_at)*

Timestamp of when the object was last updated.

application *string* *non-empty*

ID of the `Application` associated with the resource.

entity *object* *(entity\_buyer)*

identity\_roles *Array of strings* *(identity\_roles)*

The sets of permissions available to the `Identity`.

ItemsEnum "APPLICATION\_OWNER" "BENEFICIAL\_OWNER" "BUYER" "PLATFORM\_OWNER" "RECIPIENT" "SELLER" "SENDER"

type *string*

The `Identity` type.

Value "PERSONAL"

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

\_links *object*

### Step 2: Create a Payment Instrument

Payment Instruments represent your buyer's payment methods (either cards or bank accounts), from which you can accept payments. Buyers can have multiple Payment Instruments associated with their Identity.

Finix offers many different solutions for securely collecting payment method information from your buyers, including our tokenization forms / SDKs, as well as our digital wallet and Plaid integrations. Finix's vault securely encrypts and stores your buyers' Payment Instruments.

When you use one of our secure options to tokenize your buyer's card or bank account information, you can use the `token` Finix sends you to create a Payment Instrument. (When you use one of our digital wallet or Plaid integrations, Finix will send you a `third_party_token`).

Handling Raw Card Data

If you are PCI-compliant and wish to handle raw card data directly, see [Handling Raw Card Data](https://docs.finix.com/guides/online-payments/payment-tokenization/handling-raw-card-data).

identity *string* required

The ID of the `Identity` used to create the `Payment Instrument` resource.

name *string*

The name of the bank account or card owner. This value can get truncated to comply with processor requirements.

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

token *string* required

ID of the `Token` that was returned from the tokenization client or hosted fields

type *string* required

Type of `Payment Instrument`.

Value "TOKEN"

id *string* *(id)* *non-empty*

The ID of the resource.

created\_at *string* *(date-time)* *(created\_at)*

Timestamp of when the object was created.

updated\_at *string* *(date-time)* *(updated\_at)*

Timestamp of when the object was last updated.

created\_via *string* *(created\_via)*

The method by which the resource was created.

Value "API"

account\_updater\_enabled *boolean* *(account\_updater\_enabled\_card)*

When enabled at the `Payment Instrument` -level, Finix automatically checks for updates with card networks. This Account Updater functionality:

- Automatically updates card details (e.g., number or expiration date) to maintain continuity of charges, increasing authorization rates.
- Saves the cardholder the hassle of updating card details across `Merchants` for each of their `Subscriptions`.

If set at the `Application` level, this `Payment Instrument` -level setting will override the `Application` -level configuration. If not configured at the `Application` -level, the card defaults to `false`, requiring explicit opt-in.

**Note**: Cards created before the feature is enabled are unaffected by default. To include these cards, you can manually enable the Account Updater functionality for each card individually using a PUT request. Once enabled, you can link the card to this API call to trigger updates with card networks.

Default false

address *object*

The address of the card owner. Including a postal or zip code when creating a `Payment Instrument` can lower the interchange on credit card transactions.

address\_verification *string*

- Details the results of verifying `address` with the issuing bank.
- Set to **UNKNOWN** when `address` gets updated.

Enum "POSTAL\_CODE\_AND\_STREET\_MATCH" "STREET\_MATCH" "POSTAL\_CODE\_MATCH" "NO\_ADDRESS" "NO\_MATCH" "NOT\_SUPPORTED" "UNKNOWN"

application *string* *(application\_id)* *non-empty*

ID of the `Application` the resource was created under.

bin *string*

Bank Identification number for the `Payment Instrument`.

brand *string*

The `brand` of the card saved in the `Payment Instrument`.

Enum "UNKNOWN" "DINERS\_CLUB\_INTERNATIONAL" "DANKORT" "MIR" "TROY" "UATP" "CHINA\_T\_UNION" "CHINA\_UNION\_PAY" "AMERICAN\_EXPRESS" "VERVE"

card\_type *string*

The type of payment card saved in the `Payment Instrument`.

Enum "CREDIT" "DEBIT" "HSA\_FSA" "NON\_RELOADABLE\_PREPAID" "RELOADABLE\_PREPAID" "UNKNOWN"

country *string or null* *(country)*

Enum "ABW" "AFG" "AGO" "AIA" "ALA" "ALB" "AND" "ARE" "ARG" "ARM"

currency *string* *(currency)*

ISO 4217 3-letter currency code.

Enum "AED" "AFN" "ALL" "AMD" "ANG" "AOA" "ARS" "AUD" "AWG" "AZN"

disabled\_code *string or null*

disabled\_message *string or null*

enabled *boolean*

Indicates whether the `Payment Instrument` resource is enabled. The default value is `true`; set it to `false` to disable the `Payment Instrument`.

expiration\_month *integer* *\[ 1.. 12 \]*

Expiration month (e.g. 12 for December).

expiration\_year *integer* *\>= 1*

4-digit expiration year.

fast\_funds\_indicator *string*

Details if Fast Funds is enabled for the card.

fingerprint *string*

Unique ID that represents the tokenized card data.

Example:"FPRxxxxxxxxxxxxxxxxx"

identity *string* *(identity\_id)*

The ID of the `Identity` used to create the resource.

instrument\_type *string*

The type of `Payment Instrument`.

Enum "PAYMENT\_CARD" "TOKEN"

issuer\_country *string*

The Alpha-3 Code of the country the card was issued in.

In addition, the following values are possible:

- `NON_USA` - The card was issued outside of the United States.
- `UNKNOWN` - The processor did not return an issuer country for this particular BIN.

Enum "ABW" "AFG" "AGO" "AIA" "ALA" "ALB" "AND" "ARE" "ARG" "ARM"

last\_four *string*

Last four digits of the card.

name *string or null*

The name of the card owner.

network\_token\_enabled *boolean* *(network\_token\_enabled\_card)*

When enabled at the `Payment Instrument` level, a "network token" replaces raw card details (e.g., the 16-digit PAN and expiration date) for transactions. Network tokens have several benefits:

- The token offers increased authorization rates, even for lost or stolen cards, as it remains valid while the physical card is replaced.
- Visa reduces interchange fees when using network tokens.
- Tokens enhance security by replacing card details with a non-sensitive string that is usable only within the Finix system.

If set at the `Application` level, this `Payment Instrument` level setting will override the application level configuration. If not configured at the application level, the card defaults to `false`, requiring explicit opt-in.

**Note**: Cards created before the feature is enabled are unaffected. To include them, update an individual `Payment Instrument`. Then, you can insert the hyperlink on the "update".

Default false

network\_token\_state *string*

The state of the network token. The possible enum values are as follows:

- `NOT_ENABLED`: The `network_token_state` is `NOT_ENABLED` when the value of `network_token_enabled` on the `Payment Instrument` is `false`.
- `PENDING`: Immediately after Finix enables network tokens for a specific card, `network_token_state` is initially set to `PENDING`.
- `ACTIVE`: After Finix receives the network token successfully from the card network, `network_token_state` updates to `ACTIVE`.
- `FAILED`: In the event that there is an issue with the card network such as service becomes unavailable, `FAILED` is returned.
- `SUSPENDED`: When the issuing bank does not allow the network token to be used in transactions, `SUSPENDED` is returned.
- `CLOSED`: In the event that the issuing bank has closed the card permanently, `CLOSED` is returned.

Enum "ACTIVE" "CLOSED" "FAILED" "NOT\_ENABLED" "SUSPENDED" "PENDING"

online\_gambling\_block\_indicator *string*

Details if the card is enabled to receive push-payments for online gambling payouts.

payload\_type *string*

Enum "SOURCE" "DESTINATION"

push\_funds\_block\_indicator *string*

Details if the card is enabled to receive push-to-card disbursements.

security\_code\_verification *string*

Details the results of the Card Verification Code check.

Enum "MATCHED" "UNKNOWN" "UNMATCHED"

third-party *string or null*

This field is not applicable to payment cards.

third\_party\_token *string or null*

This field is not applicable to payment cards.

type *string*

Type of `Payment Instrument`.

Enum "PAYMENT\_CARD" "TOKEN" "GOOGLE\_PAY" "APPLE\_PAY"

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

\_links *object*

For your convenience, every response includes several URLs which link to resources relevant to the request. You can use these `_links` to make your follow-up requests and quickly access relevant IDs.

### Step 3: Create a Transfer

With your buyer's Identity and their Payment Instrument created, you are ready to make the payment. Finix offers two flows:

- **Direct Sale**: One-step transaction that charges the Payment Instrument directly.
- **Authorization and Capture**: Two-step transaction that creates an Authorization you can capture later

Customers use the authorization and capture flow when they want to create a hold on a card, and charge the full amount later. This flow is available for cards only. For more information, see [Auth and Captures](https://docs.finix.com/guides/online-payments/payment-features/auth-and-captures).

To make a direct sale, create a Transfer:

- Set the `source` to your Buyer's Payment Instrument ID
- Set the `merchant` to an `APPROVED` Merchant account
- Include a `fraud_session_id` to reduce fraud risk

Fraud Session ID

Include the `fraud_session_id` to reduce fraud risk. For more information, see [Fraud Detection](https://docs.finix.com/guides/online-payments/fraud-and-risk/fraud-detection).

fraud\_session\_id *string*

Including the `fraud_session_id` allows Finix to review buyer information, such as IP address and web browser, to confirm if fraud occurred during that specific checkout session.

amount *integer* *(int64)* *(amount)* required

The total amount that will be debited in cents (e.g. 100 cents to debit $1.00).

currency *string* *(currency)* required

ISO 4217 3-letter currency code.

Enum "AED" "AFN" "ALL" "AMD" "ANG" "AOA" "ARS" "AUD" "AWG" "AZN"

merchant *string* required

The ID of the `Merchant` under which to create the `Transfer`.

source *string* *(source)* required

ID of the `Payment Instrument` where funds get debited.

Example:"PIxxxxxxxxxxxxxxxxxx"

idempotency\_id *string or null* *(idempotency\_id)*

Pass any randomly generated or internal ID to [idempotently](https://docs.finix.com/api/section/idempotent-requests) identify `Transfers`, `Authorizations`, or refund requests.

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

A successful request returns a `201 Created` status code, with the response body containing the `Transfer` resource:

id *string* *(id)* *non-empty*

The ID of the resource.

created\_at *string* *(date-time)* *(created\_at)*

Timestamp of when the object was created.

updated\_at *string* *(date-time)* *(updated\_at)*

Timestamp of when the object was last updated.

additional\_buyer\_charges *object or null*

Details about any [Buyer Charges](https://docs.finix.com/guides/online-payments/payment-features/buyer-charges) included in the `Transfer`. The buyer charges are mutually exclusive.

additional\_healthcare\_data *object or null* *(additional\_healthcare\_data)*

additional\_purchase\_data *object or null* *(additional\_purchase\_data)*

Additional information about the purchase. Used for [Level 2 and Level 3 Processing](https://docs.finix.com/guides/online-payments/payment-features/level-2-level-3-processing).

address\_verification *string or null*

Details the results of the address verification checks.

Enum "POSTAL\_CODE\_AND\_STREET\_MATCH" "STREET\_MATCH" "POSTAL\_CODE\_MATCH" "NO\_ADDRESS" "NO\_MATCH" "NOT\_SUPPORTED" "UNKNOWN"

amount *number* *(double)*

The total amount that will be debited. The value may be returned as either:

- an **integer** (`int32`) in cents for all transfer types except `FEE` (e.g., `100` = $1.00).
- a **number** (`double`) if `Transfer#type` is `FEE` for a fractional amount (e.g., `2.393`).

Example:2.393

amount\_requested *number* *(double)*

Details the `amount` that was requested to get debited from the `source` when the transaction was created. The value may be returned as either:

- an **integer** (`int32`) in cents for all transfer types except `FEE` (e.g., `100` = $1.00)
- a **number** (`double`) if `Transfer#type` is `FEE` for a fractional amount (e.g., `2.393`)

Example:2.393

application *string* *non-empty*

ID of the `Application` associated with the resource.

bank\_return\_details *object or null*

Details about a transfer that was returned and was unable to be processed. Only present when `state` is `RETURNED`

card\_present\_details *object or null*

Details needed to process card present transactions.

currency *string* *(currency)*

ISO 4217 3-letter currency code.

Enum "AED" "AFN" "ALL" "AMD" "ANG" "AOA" "ARS" "AUD" "AWG" "AZN"

destination *string or null*

ID of the `Payment Instrument` where funds will be sent.

device *string*

The ID of the `Device` resource the `Transfer` was created under.

externally\_funded *string*

Details if the `Transfer` will be settled externally by card processors.

failure\_code *string or null* *(failure\_code)*

The code of the failure so the decline can be handled programmatically. For more info on how to handle the failure, see [Failure Codes](https://docs.finix.com/additional-resources/developers/implementation-and-testing/error-codes/#failure-codes).

failure\_message *string or null* *(failure\_message)*

A human-readable description of why the transaction was declined. This will also include a suggestion on how to complete the payment.

fee *integer* *(int64)* *(fee)*

The minimum amount of the `Transfer` you'd like to collect as your fee in cents. Defaults to zero (must be less than or equal to the `amount`).

- If the fees applied by the 'Fee Profile' are ***higher*** than the value passed in 'fee', 'fee' will not be applied and have no effect.
- If the fees applied by the 'Fee Profile' are ***lower*** than the value passed in 'fee', an additional fee is be applied, in addition to the fees generated by the `Fee Profile`.
	- The additional fee is equal to the difference between the value passed in 'fee' and the fees generated by the `Fee Profile`.

fee\_profile *string*

The ID of the `Fee Profile` that will be used for calculating fees for this transfer.

fraud\_session\_id *string* *(fraud\_session\_id)*

The [session ID](https://docs.finix.com/guides/online-payments/fraud-and-risk/fraud-detection#step-3-get-the-session-id) you want to review for fraud. For more info, see [Fraud Detection](https://docs.finix.com/guides/online-payments/fraud-and-risk/fraud-detection).

fee\_type *string*

Details the type of fee if the `Transfer` includes a `fee`.

Enum "ACH\_BASIS\_POINTS" "ACH\_CREDIT\_RETURN\_FIXED\_FEE" "ACH\_DEBIT\_RETURN\_FIXED\_FEE" "ACH\_FIXED" "ACH\_MAX\_FIXED" "ACH\_NOTICE\_OF\_CHANGE\_CREDIT\_FIXED" "ACH\_NOTICE\_OF\_CHANGE\_DEBIT\_FIXED" "AMERICAN\_EXPRESS\_ASSESSMENT\_BASIS\_POINTS" "AMERICAN\_EXPRESS\_BASIS\_POINTS" "AMERICAN\_EXPRESS\_FIXED"

idempotency\_id *string or null* *(idempotency\_id)*

Pass any randomly generated or internal ID to [idempotently](https://docs.finix.com/api/section/idempotent-requests) identify `Transfers`, `Authorizations`, or refund requests.

merchant *string*

The ID of the `Merchant` resource the `Transfer` was created under.

Example:"MUxxxxxxxxxxxxxxxxxxxxxxx"

merchant\_identity *string*

The ID of `Identity` resource used by the `Merchant` the `Transfer` was created under.

Example:"IDxxxxxxxxxxxxxxxxxxxxxxxx"

network\_details *object*

Contains network-specific fields used by issuers to identify transactions.

operation\_key *string or null*

Details the operation that's performed in the transaction.

Enum "PUSH\_TO\_CARD" "PULL\_FROM\_CARD" "CARD\_PRESENT\_DEBIT" "CARD\_NOT\_PRESENT\_SALE" "CARD\_PRESENT\_SALE" "CARD\_PRESENT\_UNREFERENCED\_REFUND" "SALE" "UNREFERENCED\_REFUND" "MERCHANT\_CREDIT\_ADJUSTMENT" "MERCHANT\_DEBIT\_ADJUSTMENT"

parent\_transfer *string or null*

- ID of the original parent `Transfer` where the transaction occurred.
- Only is present when `type` is `REVERSAL` or `FEE`.

parent\_transfer\_trace\_id *string or null*

- The `trace_id` of the original parent `Transfer` where the transaction occurred.
- Only visible when `type` is `REVERSAL` or `FEE`.

messages *Array of strings*

Message field that provides additional details.

Default \[\]

raw *(object or null) or (string or null)*

Raw response from the processor.

Any of:

Raw response from the processor.

*object or null*

Raw response from the processor.

ready\_to\_settle\_at *string or null* *(date-time)*

The timestamp indicating when the `Transfer` is ready to be settled.

receipt\_last\_printed\_at *string or null* *(date-time)*

Timestamp when the receipt was last printed.

security\_code\_verification *string*

Details the results of the Card Verification Code check.

Enum "MATCHED" "UNKNOWN" "UNMATCHED"

source *string or null*

The ID of the `Payment Instrument` that will be debited and performing the `Transfer`.

split\_transfers *Array of strings*

- Array containing the resource IDs of the `Split Transfers` generated from the `Transfer`.
- Only used for Split Transactions. For more information, see [Split Transactions](https://docs.finix.com/guides/online-payments/payment-features/split-transactions).

Default \[\]

state *string*

The status of the `Transfer`.

Enum "CANCELED" "PENDING" "FAILED" "SUCCEEDED" "UNKNOWN" "RETURNED"

statement\_descriptor *string or null* *(statement\_descriptor)* *<= 22 characters*

The description of the `Merchant` that appears on the buyer's bank or card statement.

subtype *string*

Additional information describing the `payment_type`.

Enum "API" "APPLICATION\_FEE" "DISPUTE" "MERCHANT\_CREDIT" "MERCHANT\_CREDIT\_ADJUSTMENT" "MERCHANT\_DEBIT" "MERCHANT\_DEBIT\_ADJUSTMENT" "PLATFORM\_CREDIT" "PLATFORM\_CREDIT\_ADJUSTMENT" "PLATFORM\_DEBIT"

supplemental\_fee *string or null*

Amount in cents for which an additional fee will be created in addition to any fees created from the assigned fee profile.

tip\_amount *integer or null*

The tip amount included in the total amount.

trace\_id *string or null*

Trace ID of the `Transfer`. The processor sends back the `trace_id` so you can track the `Transfer` end-to-end.

type *string*

Type of `Transfer`.

Enum "DEBIT" "CREDIT" "REVERSAL" "FEE" "ADJUSTMENT" "DISPUTE" "RESERVE" "SETTLEMENT" "UNKNOWN"

tags *object or null* *(tags)*

Include up to 50 `key: value` pairs to annotate requests with custom metadata.

- Maximum character length for individual `keys` is 40.
- Maximum character length for individual `values` is 500.(For example, `order_number: 25`, `item_type: produce`, `department: sales`)

\_links *object*

#### Transfer States

Use the Transfer's `state` to understand where it is in the payment lifecycle. While you should expect most Transfers to succeed, some may fail (for example, when the buyer's bank declines the transaction). Note that most Sandboxes are configured for instant Transfer approval, but can be configured for asynchronous approval where Transfers return as pending.

| State | Description |
| --- | --- |
| `PENDING` | The Transfer is still processing and will resolve to another state. If the Transfer stays `PENDING` for an extended period of time, reach out to [Finix Support](https://docs.finix.com/guides/online-payments/). |
| `SUCCEEDED` | The Transfer was successful, and the funds will soon be available in a [Payout](https://docs.finix.com/guides/after-the-payment/payouts). The `ready_to_settle_at` field indicates when the Transfer will be included / batched into a Settlement. |
| `FAILED` | The Payment was declined. Refer to the `failure_code` and `failure_message` to learn . |
| `CANCELED` | There was an issue with the processor, please reach out to [Finix Support](https://docs.finix.com/guides/online-payments/). |
| `UNKNOWN` | A connection or timeout issue occurred while creating the Transfer. Reattempt the Transfer. |

---

## Low-Code / No-Code Solutions

Businesses that want to get started accepting payments without building a custom integration can use Finix's low-code / no-code online payment solutions. Read the guides below to learn how to get started.### [Checkout Pages](https://docs.finix.com/guides/online-payments/low-code-no-code/checkout-pages)

[

Build custom low-code Checkout Pages.

](https://docs.finix.com/guides/online-payments/low-code-no-code/checkout-pages)Payment Links

Create and send Payment Links to help buyers easily complete transactions.

[View original](https://docs.finix.com/guides/online-payments/low-code-no-code/payment-links)Virtual Terminal

Create and process payments with Finix's Virtual Terminal.

[View original](https://docs.finix.com/guides/online-payments/low-code-no-code/virtual-terminal)

---

## Payment Methods

Finix lets you accept payments from both cards and bank accounts, which Finix lets you collect and store securely with out tokenization forms / SDKs, as well as our digital wallet and Plaid integrations. You can customize which payment methods you want to support depending on which integration paths you take.### [Tokenization](https://docs.finix.com/guides/online-payments/payment-tokenization)

[

Securely collect payment details for your buyers and sellers.

](https://docs.finix.com/guides/online-payments/payment-tokenization)Digital Wallets

Integrate Apple Pay™ and Google Pay™.

[View original](https://docs.finix.com/guides/online-payments/digital-wallets)Plaid

Add bank accounts to Finix with Plaid.

[View original](https://docs.finix.com/guides/online-payments/bank-payments/plaid-integration)

---

## Payment Features

Finix supports a variety of different payment features to let you customize your payments integration:

- [Use authorizations and captures](https://docs.finix.com/guides/online-payments/payment-features/auth-and-captures) to create temporary holds before capturing full amounts later.
- [Enable buyer charges](https://docs.finix.com/guides/online-payments/payment-features/buyer-charges) to collect additional fees, such as convenience or service fees.
- [Collect tips](https://docs.finix.com/guides/online-payments/payment-features/collecting-tips) from buyers.
- [Accept FSA and HSA cards](https://docs.finix.com/guides/online-payments/payment-features/fsa-and-hsa-cards) for health-related payments.
- [Enable Level 2 / Level 3](https://docs.finix.com/guides/online-payments/payment-features/level-2-level-3-processing) processing to reduce interchange rates.
- [Send receipts](https://docs.finix.com/guides/online-payments/payment-features/sending-receipts) to your buyers.

---

## Fraud and Risk

Learn about the variety of tools that Finix offers to manage fraud and risk:

- [Use 3D Secure Authentication](https://docs.finix.com/guides/online-payments/fraud-and-risk/3d-secure-authentication) for an extra security layer when accepting card payments.
- [Disable payment instruments](https://docs.finix.com/guides/online-payments/fraud-and-risk/disabling-instruments) you know to be fraudulent.
- [Integrate into Finix's fraud detection solution](https://docs.finix.com/guides/online-payments/fraud-and-risk/fraud-detection) to mitigate chargeback risk.
- [Handle declined payments](https://docs.finix.com/guides/online-payments/fraud-and-risk/handling-declined-payments) to learn what to do when payments fail.
- [Enable risk rules and card checks](https://docs.finix.com/guides/online-payments/fraud-and-risk/risk-rules-card-checks) to verify card details before accepting payments.

---

## After the Payment

After accepting an online payment, there are some final steps:

- [Learn how you get paid from the payments you've processed](https://docs.finix.com/guides/after-the-payment/payouts).
- [Learn how to refund payments](https://docs.finix.com/guides/after-the-payment/refunds).
- [Learn what to do when a buyer reports a payment to their issuing bank](https://docs.finix.com/guides/after-the-payment/disputes).