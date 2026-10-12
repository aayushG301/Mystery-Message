import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.DB_URI as string;

if (!uri) {
  throw new Error("DB_URI is not defined in the .env file");
}

export const client = new MongoClient(uri);

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState;

    console.log("DB connected");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
