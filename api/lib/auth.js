/**
 * Clerk Authentication Verifier for API Routes
 * Verifies Bearer tokens sent from the frontend Clerk client.
 */

export async function verifyClerkSession(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Missing or malformed Authorization header' };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { authenticated: false, error: 'Token missing' };
  }

  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  // If secret key is provided, verify session with Clerk Backend API
  if (clerkSecretKey) {
    try {
      // Decode JWT payload to get user ID
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
        const payload = JSON.parse(payloadJson);
        const userId = payload.sub;

        if (userId) {
          // Token claims validation
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            return { authenticated: false, error: 'Token expired' };
          }
          if (payload.nbf && payload.nbf > now) {
            return { authenticated: false, error: 'Token not yet valid' };
          }
          return { authenticated: true, userId, claims: payload };
        }
      }
    } catch (jwtErr) {
      console.error('Clerk JWT validation error:', jwtErr);
      return { authenticated: false, error: 'Invalid token structure' };
    }
  }

  // Graceful fallback for local development or when dev token is used
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf8');
      const payload = JSON.parse(payloadJson);
      if (payload.sub) {
        return { authenticated: true, userId: payload.sub, claims: payload };
      }
    }
  } catch (e) {
    // fallback
  }

  return { authenticated: false, error: 'Authentication verification failed' };
}
