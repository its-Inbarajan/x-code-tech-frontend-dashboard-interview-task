import mongoose from "mongoose";

const mongo_url = process.env.MONGODB_URL!;

if (!mongo_url) {
  throw new Error("Please define the MONGO_URI environment variable");
}

export async function connectDB() {
  return mongoose.connect(mongo_url, { dbName: "interview" });
}
