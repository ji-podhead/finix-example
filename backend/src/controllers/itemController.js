import { getDb } from '../services/mongo.js';
import { ObjectId } from 'mongodb';

export const createItem = async (req, res) => {
    console.log("Received request to create item:", req.body);
    try {
        const { name, price, currency } = req.body;
        const { merchantId } = req.params;

        if (!name || !price || !currency || !merchantId) {
            return res.status(400).json({ error: 'Missing required fields: name, price, currency, merchantId' });
        }

        const db = getDb();
        const newItem = {
            name,
            price: parseFloat(price),
            currency,
            merchantId: new ObjectId(merchantId), // Store as ObjectId for proper querying
        };

        const result = await db.collection('items').insertOne(newItem);
        // The insertedId is on the result object, not the document itself
        const createdItem = { ...newItem, _id: result.insertedId };

        res.status(201).json(createdItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: error.message || 'An unknown error occurred' });
    }
};

export const getItemsByMerchant = async (req, res) => {
    console.log("Received request to fetch items for merchant:", req.params.merchantId);
    try {
        const { merchantId } = req.params;

        if (!merchantId) {
            return res.status(400).json({ error: 'Missing merchantId' });
        }

        const db = getDb();
        const items = await db.collection('items').find({ merchantId: new ObjectId(merchantId) }).toArray();

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: error.message });
    }
};
