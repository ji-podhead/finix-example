import finixApi from '../services/finix.js';
import { getDb } from '../services/mongo.js';

export const createMerchantIdentity = async (req, res) => {
    console.log("Received request to create merchant identity:", req.body);
    try {
        const identity = await finixApi('/identities', {
            method: 'POST',
            body: JSON.stringify(req.body),
        });

        const db = getDb();
        await db.collection('identities').insertOne(identity);
        console.log("Merchant identity stored in MongoDB:", identity.id);

        res.status(201).json(identity);
    } catch (error) {
        console.error("Error creating merchant identity:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createMerchant = async (req, res) => {
  console.log("Received request to create merchant:", req.body);
  try {
    const {
      name, email, businessName, businessAddress, dob, annualCardVolume,
      defaultStatementDescriptor, hasAcceptedCreditCardsPreviously,
      incorporationDate, maxTransactionAmount, mcc, ownershipType, phone,
      principalPercentageOwnership, taxId, title, url
    } = req.body;

    let identityId = req.body.identityId;
    if (!identityId) {
      const identity = await finixApi('/identities', {
        method: 'POST',
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
      });
      identityId = identity.id;
      console.log("Dummy identity created with ID:", identityId);
    }

    const newMerchant = await finixApi(`/identities/${identityId}/merchants`, {
      method: 'POST',
      body: JSON.stringify({
        processor: "DUMMY_V1",
        merchant_name: businessName || name,
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
    });

    const db = getDb();
    await db.collection('merchants').insertOne({ ...newMerchant, identityId });
    console.log("Merchant stored in MongoDB:", newMerchant.id);

    res.status(201).json(newMerchant);
  } catch (error) {
    console.error("Error creating merchant:", error);
    res.status(500).json({ error: error.message || error });
  }
};

export const getMerchants = async (req, res) => {
    console.log("Received request to fetch merchants from MongoDB");
    try {
        const db = getDb();
        const merchants = await db.collection("merchants").find({}).toArray();
        console.log(`Fetched ${merchants.length} merchants from MongoDB`);
        res.status(200).json(merchants);
    } catch (error) {
        console.error("Error fetching merchants from MongoDB:", error);
        res.status(500).json({ error: error.message });
    }
};
