import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'fard_vault';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(dbName);

  // Ensure indexes
  try {
    await db.collection('user_salts').createIndex({ userId: 1 }, { unique: true });
    await db.collection('vault_entries').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('vault_entries').createIndex({ userId: 1, category: 1 });
    await db.collection('rate_limits').createIndex({ identifier: 1, action: 1 }, { unique: true });
  } catch (idxErr) {
    console.warn('Index initialization note:', idxErr.message);
  }

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
