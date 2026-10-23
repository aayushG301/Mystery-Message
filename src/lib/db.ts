import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.DB_URI as string;

if (!uri) {
  throw new Error("DB_URI is not defined in the .env file");
}

// Keep one instance of each across dev hot reloads.
const globalForDb = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongooseConn?: Promise<typeof mongoose>;
};

// Used by better-auth (users, sessions, accounts).
export const client = globalForDb.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForDb.mongoClient = client;

// Used by Mongoose models (messages).
async function dbConnect(): Promise<typeof mongoose> {
  if (!globalForDb.mongooseConn) {
    globalForDb.mongooseConn = mongoose.connect(uri).catch((error) => {
      globalForDb.mongooseConn = undefined; // allow a retry on the next call
      throw error;
    });
  }
  return globalForDb.mongooseConn;
}

export default dbConnect;
