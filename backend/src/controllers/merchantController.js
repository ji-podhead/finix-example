import finixApi from '../services/finix.js';
import { getDb } from '../services/mongo.js';
import { merchantSchema, identitySchema } from '../validation/schemas.js';

export const createIdentity = async (req, res) => {
    console.log("Received request to create identity:", req.body);
    try {
        const { error, value } = identitySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const identity = await finixApi('/identities', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        const db = getDb();
        await db.collection('identities').insertOne(identity);
        console.log("Identity stored in MongoDB:", identity.id);

        res.status(201).json(identity);
    } catch (error) {
        console.error("Error creating identity:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const createMerchant = async (req, res) => {
    console.log("Received request to create merchant:", req.body);
    try {
        const { identityId } = req.params;

        const { error, value } = merchantSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const newMerchant = await finixApi(`/identities/${identityId}/merchants`, {
            method: 'POST',
            body: JSON.stringify(value),
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
