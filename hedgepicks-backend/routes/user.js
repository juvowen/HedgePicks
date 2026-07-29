const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/db');
const crypto = require('crypto');
const { ObjectId } = require('mongodb');

router.post('/signup', async (req, res) => {
  try {
    const conn = getCollection('users');
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await conn.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const salt = crypto.randomBytes(11).toString('hex');
    const keyLength = 11;
    const cryptoPassword = crypto.scryptSync(password, salt, keyLength).toString('hex');

    const newUser = { name, email, password: cryptoPassword, salt };
    const result = await conn.insertOne(newUser);

    req.session.userId = result.insertedId.toString();
    res.json({ success: true, user: { name, email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const conn = getCollection('users');
    const { email, password } = req.body;

    const dbUser = await conn.findOne({ email });
    if (!dbUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const keyLength = 11;
    const cryptoPassword = crypto.scryptSync(password, dbUser.salt, keyLength).toString('hex');

    if (cryptoPassword === dbUser.password) {
      req.session.userId = dbUser._id.toString();
      res.json({ success: true, user: { name: dbUser.name, email: dbUser.email } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const conn = getCollection('users');
    const dbUser = await conn.findOne({ _id: new ObjectId(req.session.userId) });
    if (!dbUser) return res.status(401).json({ error: 'Not logged in' });
    res.json({ user: { name: dbUser.name, email: dbUser.email } });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const conn = getCollection('users');
    const { name, email, password } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (password) {
      const salt = crypto.randomBytes(11).toString('hex');
      const keyLength = 11;
      updates.password = crypto.scryptSync(password, salt, keyLength).toString('hex');
      updates.salt = salt;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // filter
    if (email) {
      const existing = await conn.findOne({ email, _id: { $ne: new ObjectId(req.session.userId) } });
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    await conn.updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $set: updates }
    );

    const updatedUser = await conn.findOne({ _id: new ObjectId(req.session.userId) });
    res.json({ success: true, user: { name: updatedUser.name, email: updatedUser.email } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    const conn = getCollection('users');
    await conn.deleteOne({ _id: new ObjectId(req.session.userId) });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Account deleted but logout failed' });
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;