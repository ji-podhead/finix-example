import express, { json } from "express";
import cors from "cors";
import { Client, Environment } from "@finix-payments/finix";
import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const port = 3001;

// MongoDB Connection URI
const uri = process.env.MONGO_URI || "mongodb://mongo:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    // Ping the database to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Exit the process if MongoDB connection fails
    process.exit(1);
  }
}

// Call the connection function when the server starts
connectToMongo();

const corsOptions = {
  origin: ["http://localhost:3000", process.env.FINIX_API_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(json()); // For parsing application/json

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${Buffer.from(`${process.env.FINIX_API_USERNAME}:${process.env.FINIX_API_PASSWORD}`).toString('base64')}`
};

// In-memory store for merchants
let merchants = [];

// Endpoint to create a merchant
app.post("/create_merchant", async (req, res) => {
  console.log("Received request to create merchant:", req.body);
  try {
    const { 
      name, email, businessName, businessAddress, dob, annualCardVolume, 
      defaultStatementDescriptor, hasAcceptedCreditCardsPreviously, 
      incorporationDate, maxTransactionAmount, mcc, ownershipType, phone, 
      principalPercentageOwnership, taxId, title, url 
    } = req.body;

    // Finix API requires an identity to create a merchant. 
    // For simplicity in this sandbox, we'll create a dummy identity if one isn't provided.
    // In a real application, you would fetch or create an identity first.
    let identityId = req.body.identityId; // Assume identityId is passed from frontend or created beforehand
    if (!identityId) {
      // Create a dummy identity for the merchant
      const identityResponse = await fetch(
        "https://finix.sandbox-payments-api.com/identities",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            entity: {
              email: email || "dummy@example.com",
              first_name: name?.split(' ')[0] || "Dummy",
              last_name: name?.split(' ')[1] || "Merchant",
              phone: phone || "1234567890",
              business_address: businessAddress,
              dob: dob,
              business_name: businessName,
              url: url,
              tax_id: taxId,
              title: title,
            },
            identity_roles: ["SELLER"],
            type: "BUSINESS",
          }),
        }
      );
      if (!identityResponse.ok) {
        const error = await identityResponse.json();
        console.error("Error creating dummy identity:", JSON.stringify(error));
        return res.status(identityResponse.status).json({ error: error });
      }
      const identity = await identityResponse.json();
      identityId = identity.id;
      console.log("Dummy identity created with ID:", identityId);
    }

    // Create the merchant using the identity
    const merchantResponse = await fetch(
      `https://finix.sandbox-payments-api.com/identities/${identityId}/merchants`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          processor: "DUMMY_V1", // Using a dummy processor as per platform.md example
          merchant_name: businessName || name, // Use businessName if available, otherwise name
          mcc: mcc,
          default_statement_descriptor: defaultStatementDescriptor,
          annual_card_volume: annualCardVolume ? parseInt(annualCardVolume) : undefined,
          max_transaction_amount: maxTransactionAmount ? parseInt(maxTransactionAmount) : undefined,
          ownership_type: ownershipType,
          principal_percentage_ownership: principalPercentageOwnership ? parseInt(principalPercentageOwnership) : undefined,
          has_accepted_credit_cards_previously: hasAcceptedCreditCardsPreviously,
          incorporation_date: incorporationDate,
          url: url,
          business_address: businessAddress,
          phone: phone,
          tax_id: taxId,
          title: title,
          email: email,
          dob: dob,
        }),
      }
    );

    if (!merchantResponse.ok) {
      const error = await merchantResponse.json();
      console.error("Error creating merchant:", JSON.stringify(error));
      return res.status(merchantResponse.status).json({ error: error });
    }

    const newMerchant = await merchantResponse.json();
    
    // Add the created merchant to our in-memory store
    merchants.push(newMerchant);

    res.status(201).json(newMerchant);
  } catch (error) {
    console.error("Error creating merchant:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch all merchants
app.get("/merchants", async (req, res) => {
  console.log("Received request to fetch merchants");
  try {
    const merchantsResponse = await fetch(
      `https://finix.sandbox-payments-api.com/merchants?limit=100`,
      { headers }
    );

    if (!merchantsResponse.ok) {
      const error = await merchantsResponse.json();
      console.error("Error fetching merchants from Finix API:", JSON.stringify(error));
      // If fetching from Finix fails, return the in-memory store as a fallback
      // In a production scenario, you might want to handle this more robustly.
      return res.status(merchantsResponse.status).json({ error: error, fallback: merchants });
    }

    const data = await merchantsResponse.json();
    
    // Update the in-memory store with the fetched merchants
    merchants = data._embedded?.merchants || [];
    console.log(`Fetched ${merchants.length} merchants from Finix API`);  
    res.status(200).json(merchants);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a buyer (Identity)
app.post("/create-buyer", async (req, res) => {
  console.log("Received request to create buyer:", req.body);
  try {
    const identityResponse = await fetch(
      "https://finix.sandbox-payments-api.com/identities",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          entity: {
            email: req.body.entity.email,
            first_name: req.body.entity.first_name,
            last_name: req.body.entity.last_name,
            phone: "1234567890",
            personal_address: {
              "city": "San Mateo",
              "country": "USA",
              "region": "CA",
              "line2": "Apartment 7",
              "line1": "741 Douglass St",
              "postal_code": "94114"
            },
          },
          identity_roles: ["BUYER"],
          type: "PERSONAL",
        }),
      }
    );
    if (!identityResponse.ok) {
      const error = await identityResponse.json();
      console.error("Error creating identity:", JSON.stringify(error));
      return res.status(identityResponse.status).json({ error: error });
    }
    else {
      console.log("Identity created successfully");
      const identity = await identityResponse.json();
      res.status(201).json(identity);
    }
  } catch (error) {
    console.error("Error creating buyer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a merchant identity
app.post("/create-merchant-identity", async (req, res) => {
  console.log("Received request to create merchant identity:", req.body);
  try {
    // Explicitly extract all expected fields from the request body, including nested ones.
    // This addresses the user's feedback to "check all variables" and ensures transparency.

    const {
      additional_underwriting_data,
      entity,
      identity_roles,
      tags,
      type,
    } = req.body;

    // Basic validation: Ensure essential top-level fields are present.
    if (!entity || !identity_roles || !type) {
      console.error("Missing required top-level fields for merchant identity creation: entity, identity_roles, or type.");
      return res.status(400).json({
        error: "Missing required top-level fields: 'entity', 'identity_roles', and 'type' are mandatory."
      });
    }

    // Further destructure nested objects for explicit handling and potential validation
    const {
      annual_ach_volume,
      average_ach_transfer_amount,
      average_card_transfer_amount,
      business_description,
      card_volume_distribution,
      credit_check_allowed,
      credit_check_ip_address,
      credit_check_timestamp,
      credit_check_user_agent,
      merchant_agreement_accepted,
      merchant_agreement_ip_address,
      merchant_agreement_timestamp,
      merchant_agreement_user_agent,
      refund_policy,
      volume_distribution_by_business_type,
    } = additional_underwriting_data || {}; // Use empty object if not provided to avoid errors

    const {
      annual_card_volume,
      business_address,
      business_name,
      business_phone,
      business_tax_id,
      business_type,
      default_statement_descriptor,
      dob,
      doing_business_as,
      email,
      first_name,
      has_accepted_credit_cards_previously,
      incorporation_date,
      last_name,
      max_transaction_amount,
      ach_max_transaction_amount,
      mcc,
      ownership_type,
      personal_address,
      phone,
      principal_percentage_ownership,
      tax_id,
      title,
      url,
    } = entity || {}; // Use empty object if not provided to avoid errors

    // Reconstruct the payload with explicitly extracted variables
    const identityPayload = {
      additional_underwriting_data: {
        annual_ach_volume,
        average_ach_transfer_amount,
        average_card_transfer_amount,
        business_description,
        card_volume_distribution,
        credit_check_allowed,
        credit_check_ip_address,
        credit_check_timestamp,
        credit_check_user_agent,
        merchant_agreement_accepted,
        merchant_agreement_ip_address,
        merchant_agreement_timestamp,
        merchant_agreement_user_agent,
        refund_policy,
        volume_distribution_by_business_type,
      },
      entity: {
        annual_card_volume,
        business_address,
        business_name,
        business_phone,
        business_tax_id,
        business_type,
        default_statement_descriptor,
        dob,
        doing_business_as,
        email,
        first_name,
        has_accepted_credit_cards_previously,
        incorporation_date,
        last_name,
        max_transaction_amount,
        ach_max_transaction_amount,
        mcc,
        ownership_type,
        personal_address,
        phone,
        principal_percentage_ownership,
        tax_id,
        title,
        url,
      },
      identity_roles,
      tags,
      type,
    };

    const identityResponse = await fetch(
      "https://finix.sandbox-payments-api.com/identities",
      {
        method: "POST",
        headers,
        body: JSON.stringify(identityPayload),
      }
    );

    if (!identityResponse.ok) {
      const error = await identityResponse.json();
      console.error("Error creating merchant identity:", JSON.stringify(error));
      return res.status(identityResponse.status).json({ error: error });
    } else {
      console.log("Merchant identity created successfully");
      const identity = await identityResponse.json();

      // Store the created identity in MongoDB
      const db = client.db("finix_sandbox");
      const collection = db.collection("identities");
      await collection.insertOne(identity);
      console.log("Merchant identity stored in MongoDB:", identity.id);

      res.status(201).json(identity);
    }
  } catch (error) {
    console.error("Error creating merchant identity:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a payment instrument
app.post("/create-payment-instrument", async (req, res) => {
  console.log("Received request to create payment instrument:", req.body);
  try {
    const { token, type, identity, name, third_party_token } = req.body;

    const paymentInstrumentBody = {
      identity,
      name,
      type: "TOKEN", // Always TOKEN for Finix.js tokenized data
    };

    if (token) {
      paymentInstrumentBody.token = token;
    } else if (third_party_token) {
      paymentInstrumentBody.third_party_token = third_party_token;
      paymentInstrumentBody.type = type; // Use the provided type for third-party tokens (e.g., GOOGLE_PAY)
    }

    const paymentInstrumentResponse = await fetch(
      "https://finix.sandbox-payments-api.com/payment_instruments",
      {
        method: "POST",
        headers,
        body: JSON.stringify(paymentInstrumentBody),
      }
    );

    if (!paymentInstrumentResponse.ok) {
      const error = await paymentInstrumentResponse.json();
      console.error("Error creating payment instrument:", JSON.stringify(error));
      return res.status(paymentInstrumentResponse.status).json({ error: error });
    } else {
      console.log("Payment Instrument created successfully");
      const paymentInstrument = await paymentInstrumentResponse.json();
      res.status(201).json(paymentInstrument);
    }
  } catch (error) {
    console.error("Error creating payment instrument:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a transfer (payment)
app.post("/create-transfer", async (req, res) => {
  console.log("Received request to create transfer:", req.body);
  try {
    const { amount, currency, source, merchant, identity, googlePayToken } = req.body;

    let paymentSource = source;

    // If googlePayToken is present, first create a Google Pay payment instrument
    if (googlePayToken) {
      const paymentInstrumentBody = {
        third_party_token: googlePayToken,
        type: "GOOGLE_PAY",
        identity: identity, // The buyer's Identity ID to associate the payment instrument to
        merchant_identity: "ID12345", // Merchant Identity ID from Finix, required for Google Pay
      };

      const paymentInstrumentResponse = await fetch(
        "https://finix.sandbox-payments-api.com/payment_instruments",
        {
          method: "POST",
          headers,
          body: JSON.stringify(paymentInstrumentBody),
        }
      );

      if (!paymentInstrumentResponse.ok) {
        const error = await paymentInstrumentResponse.json();
        console.error("Error creating Google Pay payment instrument:", JSON.stringify(error));
        return res.status(paymentInstrumentResponse.status).json({ error: error });
      }
      const paymentInstrument = await paymentInstrumentResponse.json();
      paymentSource = paymentInstrument.id;
    }

    const transferResponse = await fetch(
      "https://finix.sandbox-payments-api.com/transfers",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount)),
          currency,
          merchant,
          source: paymentSource,
        }),
      }
    );

    if (!transferResponse.ok) {
      const error = await transferResponse.json();
      console.error("Error creating transfer:", JSON.stringify(error));
      return res.status(transferResponse.status).json({ error: error });
    } else {
      console.log("Transfer created successfully");
      const transfer = await transferResponse.json();
      res.status(201).json(transfer);
    }
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch all stored identities from MongoDB
app.get("/identities", async (req, res) => {
  console.log("Received request to fetch identities from MongoDB");
  try {
    const db = client.db("finix_sandbox");
    const collection = db.collection("identities");
    const identities = await collection.find({}).toArray();
    console.log(`Fetched ${identities.length} identities from MongoDB`);
    res.status(200).json(identities);
  } catch (error) {
    console.error("Error fetching identities from MongoDB:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Simple Finix Backend is running!");
});

app.listen(port, () => {
  console.log(`Simple backend listening at http://localhost:${port}`);
});
