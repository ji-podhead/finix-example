import finixApi from '../services/finix.js';
import { getDb } from '../services/mongo.js';
import { buyerSchema } from '../validation/schemas.js';

export const createBuyer = async (req, res) => {
    console.log("Received request to create buyer:", req.body);
    try {
        const { error, value } = buyerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const identity = await finixApi('/identities', {
            method: 'POST',
            body: JSON.stringify(value),
        });

        const db = getDb();
        await db.collection('identities').insertOne(identity);
        console.log("Buyer identity stored in MongoDB:", identity.id);

        res.status(201).json(identity);
    } catch (error) {
        console.error("Error creating buyer:", error);
        res.status(500).json({ error: error.message || error });
    }
};

export const getIdentities = async (req, res) => {
    console.log("Received request to fetch identities from MongoDB");
    try {
        const db = getDb();
        const identities = await db.collection("identities").find({}).toArray();
        console.log(`Fetched ${identities.length} identities from MongoDB`);
        res.status(200).json(identities);
    } catch (error) {
        console.error("Error fetching identities from MongoDB:", error);
        res.status(500).json({ error: error.message });
    }
};
