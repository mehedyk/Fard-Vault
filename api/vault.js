import { ObjectId } from 'mongodb';
import { connectToDatabase } from './lib/db.js';
import { verifyClerkSession } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Verify authentication with Clerk
  const auth = await verifyClerkSession(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: auth.error || 'Unauthorized' });
  }

  const userId = auth.userId;

  try {
    const { db } = await connectToDatabase();
    const vaultCollection = db.collection('vault_entries');

    // 1. GET: Fetch all encrypted entries for this user
    if (req.method === 'GET') {
      const entries = await vaultCollection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

      const formatted = entries.map(doc => ({
        id: doc._id.toString(),
        encrypted_data: doc.encryptedData,
        iv: doc.iv,
        category: doc.category || 'other',
        favorite: !!doc.favorite,
        created_at: doc.createdAt,
        updated_at: doc.updatedAt
      }));

      return res.status(200).json({ entries: formatted });
    }

    // 2. POST: Insert a new encrypted entry
    if (req.method === 'POST') {
      const { encrypted_data, iv, category, favorite } = req.body || {};
      if (!encrypted_data || !iv) {
        return res.status(400).json({ error: 'encrypted_data and iv are required' });
      }

      const now = new Date();
      const newDoc = {
        userId,
        encryptedData: encrypted_data,
        iv,
        category: category || 'other',
        favorite: !!favorite,
        createdAt: now,
        updatedAt: now
      };

      const result = await vaultCollection.insertOne(newDoc);
      return res.status(201).json({
        success: true,
        id: result.insertedId.toString(),
        entry: {
          id: result.insertedId.toString(),
          ...newDoc
        }
      });
    }

    // 3. PUT: Update an existing encrypted entry
    if (req.method === 'PUT') {
      const { id, encrypted_data, iv, category, favorite } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Entry id is required' });
      }

      let objId;
      try {
        objId = new ObjectId(id);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid entry ID format' });
      }

      const updates = { updatedAt: new Date() };
      if (encrypted_data !== undefined) updates.encryptedData = encrypted_data;
      if (iv !== undefined) updates.iv = iv;
      if (category !== undefined) updates.category = category;
      if (favorite !== undefined) updates.favorite = !!favorite;

      const result = await vaultCollection.updateOne(
        { _id: objId, userId },
        { $set: updates }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Entry not found or unauthorized' });
      }

      return res.status(200).json({ success: true, message: 'Entry updated successfully' });
    }

    // 4. DELETE: Delete an encrypted entry
    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Entry id is required' });
      }

      let objId;
      try {
        objId = new ObjectId(id);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid entry ID format' });
      }

      const result = await vaultCollection.deleteOne({ _id: objId, userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Entry not found or unauthorized' });
      }

      return res.status(200).json({ success: true, message: 'Entry deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Vault API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
