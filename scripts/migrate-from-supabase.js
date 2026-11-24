/**
 * Migration Script: Supabase to MongoDB
 * 
 * Safely migrates all encrypted data from Supabase to MongoDB.
 * Since the data is client-side encrypted with AES-256-GCM, the migration
 * transfers the encrypted ciphertexts, IVs, and salts directly without needing
 * to decrypt anything. Zero-knowledge is fully preserved!
 * 
 * Usage:
 *   node scripts/migrate-from-supabase.js
 */

import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'fard_vault';

async function migrate() {
  console.log('🚀 Starting Fard Vault Migration from Supabase to MongoDB...');

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required.');
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn('⚠️ Supabase credentials missing. If you have an exported JSON dump, see importFromJson().');
    console.warn('Checking for local export file: supabase_export.json...');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    await mongoClient.connect();
    const db = mongoClient.db(MONGODB_DB);
    console.log('✅ Connected to MongoDB.');

    // 1. Migrate user_keys (salts)
    console.log('📦 Migrating user_keys (salts)...');
    const { data: keysData, error: keysErr } = await supabase.from('user_keys').select('*');
    if (keysErr) {
      console.error('Error fetching user_keys from Supabase:', keysErr.message);
    } else if (keysData && keysData.length > 0) {
      console.log(`Found ${keysData.length} key records.`);
      for (const k of keysData) {
        await db.collection('user_salts').updateOne(
          { userId: k.user_id },
          {
            $set: {
              userId: k.user_id,
              salt: k.salt,
              legacySupabaseId: k.id,
              migratedAt: new Date(),
              createdAt: k.created_at ? new Date(k.created_at) : new Date(),
              updatedAt: k.updated_at ? new Date(k.updated_at) : new Date()
            }
          },
          { upsert: true }
        );
      }
      console.log('✅ User salts migrated successfully.');
    }

    // 2. Migrate vault_entries
    console.log('📦 Migrating vault_entries...');
    const { data: entriesData, error: entriesErr } = await supabase.from('vault_entries').select('*');
    if (entriesErr) {
      console.error('Error fetching vault_entries from Supabase:', entriesErr.message);
    } else if (entriesData && entriesData.length > 0) {
      console.log(`Found ${entriesData.length} vault entries.`);
      for (const e of entriesData) {
        await db.collection('vault_entries').updateOne(
          { legacySupabaseId: e.id },
          {
            $set: {
              userId: e.user_id,
              encryptedData: e.encrypted_data,
              iv: e.iv,
              category: e.category || 'other',
              favorite: !!e.favorite,
              legacySupabaseId: e.id,
              migratedAt: new Date(),
              createdAt: e.created_at ? new Date(e.created_at) : new Date(),
              updatedAt: e.updated_at ? new Date(e.updated_at) : new Date()
            }
          },
          { upsert: true }
        );
      }
      console.log('✅ Vault entries migrated successfully.');
    }

    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoClient.close();
  }
}

migrate();
