import mongoose from "mongoose"

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const MONGODB_URI = process.env.MONGODB_URI ?? ""
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "Feed_Back_App"

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured")
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
}

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

async function dbConnect(): Promise<void> {
  if (cached.conn) {
    return
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
        serverSelectionTimeoutMS: 15000,
      })
      .then((mongooseInstance) => mongooseInstance)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }
}

export default dbConnect
