import mongoose from "mongoose";
const state = globalThis as typeof globalThis & {
  mongoPromise?: Promise<typeof mongoose>;
};
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  if (!state.mongoPromise)
    state.mongoPromise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        minPoolSize: process.env.NODE_ENV === "production" ? 1 : 0,
        maxIdleTimeMS: 60_000,
        serverSelectionTimeoutMS: 5000,
        family: 4,
      })
      .catch((error) => {
        state.mongoPromise = undefined;
        throw error;
      });
  return state.mongoPromise;
}
