import { MongoClient, ServerApiVersion } from 'mongodb';
import "dotenv/config";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

export const connectToMongo = async () => {
  console.log("Attempting to connect to MongoDB...");
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    db = client.db("finix_sandbox");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToMongo first.");
  }
  return db;
};
