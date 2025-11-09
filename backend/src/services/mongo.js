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

export const connectToMongo = () => {
  console.log("Attempting to connect to MongoDB...");
  return new Promise((resolve, reject) => {
    client.connect()
      .then(() => {
        console.log("Connected to MongoDB!");
        db = client.db("finix_sandbox");
        resolve();
      })
      .catch(error => {
        console.error("Failed to connect to MongoDB inside mongo.js:", error);
        reject(error);
      });
  });
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToMongo first.");
  }
  return db;
};
