import { connectToDatabase } from './lib/db.js';
import { verifyClerkSession } from './lib/auth.js';

export default async function handler(req, res) {
  // Set security and CORS headers
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
    const saltsCollection = db.collection('user_salts');

    if (req.method === 'GET') {
      const record = await saltsCollection.findOne({ userId });
      if (!record) {
        return res.status(404).json({ error: 'Vault salt not found. Account may not be initialized.' });
      }
      return res.status(200).json({ salt: record.salt });
    }

    if (req.method === 'POST') {
      const { salt } = req.body || {};
      if (!salt || typeof salt !== 'string' || salt.length < 16) {
        return res.status(400).json({ error: 'Valid base64 salt is required.' });
      }

      // Upsert user salt
      const now = new Date();
      await saltsCollection.updateOne(
        { userId },
        {
          $setOnInsert: { createdAt: now },
          $set: { salt, updatedAt: now }
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true, message: 'Salt saved successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(455).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('Keys API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
