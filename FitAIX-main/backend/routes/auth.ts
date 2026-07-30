import express from 'express';
import crypto from 'crypto';
import https from 'https';
import {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  createProfile,
  getProfile,
  updateProfile
} from '../db/db';

export const authRouter = express.Router();

// Helper: SHA256 Password Hash
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// REST Middleware: Authenticate Token (Supports mock & database tokens)
export const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  if (token === 'mock-user-token-123') {
    req.user = { id: 901, username: 'user', name: 'Alex Vance', role: 'user' };
    return next();
  } else if (token === 'mock-admin-token-456') {
    req.user = { id: 999, username: 'admin', name: 'Admin Moderator', role: 'admin' };
    return next();
  }

  if (token.startsWith('fitaix-token-')) {
    const userId = parseInt(token.replace('fitaix-token-', ''), 10);
    if (!isNaN(userId)) {
      const user = await getUserById(userId);
      if (user) {
        req.user = user;
        return next();
      }
    }
  }

  return res.status(403).json({ success: false, error: 'Invalid or expired token' });
};

// Login Route
authRouter.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      data: {
        token: 'mock-admin-token-456',
        user: { id: 999, name: 'Admin Moderator', username: 'admin', role: 'admin', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
      }
    });
  } else if (username === 'user' && password === 'password') {
    return res.json({
      success: true,
      data: {
        token: 'mock-user-token-123',
        user: { id: 901, name: 'Alex Vance', username: 'user', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
      }
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      const userByEmail = await getUserByEmail(username);
      if (!userByEmail) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
      if (userByEmail.password_hash !== hashPassword(password)) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
      const profile = await getProfile(userByEmail.id);
      return res.json({
        success: true,
        data: {
          token: `fitaix-token-${userByEmail.id}`,
          user: { id: userByEmail.id, name: profile?.full_name || userByEmail.username, username: userByEmail.username, role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }
        }
      });
    }

    if (user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const profile = await getProfile(user.id);
    res.json({
      success: true,
      data: {
        token: `fitaix-token-${user.id}`,
        user: { id: user.id, name: profile?.full_name || user.username, username: user.username, role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Register Route
authRouter.post('/register', async (req: any, res: any) => {
  const { username, email, password, fullName, age, gender, height, weight, fitnessGoal } = req.body;

  if (!username || !email || !password || !fullName || !age || !gender || !height || !weight || !fitnessGoal) {
    return res.status(400).json({ success: false, error: 'All fields are mandatory.' });
  }

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username is already taken.' });
    }
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, error: 'Email is already registered.' });
    }

    const passwordHash = hashPassword(password);
    const user = await createUser(username, email, passwordHash);
    const profile = await createProfile(
      user.id,
      fullName,
      Number(age),
      gender,
      Number(height),
      Number(weight),
      fitnessGoal
    );

    res.json({
      success: true,
      data: {
        token: `fitaix-token-${user.id}`,
        user: { id: user.id, name: profile.full_name, username: user.username, role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Current User Profile info
authRouter.get('/me', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.id === 901 || req.user.id === 999) {
      return res.json({ success: true, data: req.user });
    }
    const profile = await getProfile(req.user.id);
    res.json({
      success: true,
      data: {
        ...req.user,
        name: profile?.full_name || req.user.username,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Firebase Token Verification & Google Sign-In Authentication Route
authRouter.post('/firebase', async (req: any, res: any) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ success: false, error: 'Firebase ID Token is required.' });
  }

  // Handle mock token for demo environment without real Firebase keys
  if (idToken === 'mock-google-token-123') {
    try {
      const email = 'mockuser@google.com';
      const name = 'Mock Google User';
      let user = await getUserByEmail(email);
      let profile;
      if (!user) {
        const username = email.split('@')[0] + Math.floor(Math.random() * 100);
        user = await createUser(username, email, hashPassword(Math.random().toString(36)));
        profile = await createProfile(user.id, name, 25, 'Not Specified', 175, 70, 'Maintenance');
      } else {
        profile = await getProfile(user.id);
      }
      return res.json({
        success: true,
        data: {
          token: `fitaix-token-${user.id}`,
          user: {
            id: user.id,
            name: profile?.full_name || name,
            username: user.username,
            role: 'user',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
          }
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Verify Google token using Google API OAuth tokeninfo endpoint
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
  https.get(url, (response) => {
    let rawData = '';
    response.on('data', (chunk) => { rawData += chunk; });
    response.on('end', async () => {
      try {
        const payload = JSON.parse(rawData);
        if (payload.error_description) {
          return res.status(400).json({ success: false, error: payload.error_description });
        }

        const { email, name, picture } = payload;
        if (!email) {
          return res.status(400).json({ success: false, error: 'Invalid Google sign-in payload.' });
        }

        let user = await getUserByEmail(email);
        let profile;
        if (!user) {
          const username = email.split('@')[0] + Math.floor(Math.random() * 100);
          user = await createUser(username, email, hashPassword(Math.random().toString(36)));
          profile = await createProfile(user.id, name || username, 25, 'Not Specified', 175, 70, 'Maintenance');
        } else {
          profile = await getProfile(user.id);
        }

        res.json({
          success: true,
          data: {
            token: `fitaix-token-${user.id}`,
            user: {
              id: user.id,
              name: profile?.full_name || name || user.username,
              username: user.username,
              role: 'user',
              avatarUrl: picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
            }
          }
        });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ success: false, error: 'Failed to verify Firebase token: ' + err.message });
  });
});
