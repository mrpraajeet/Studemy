import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email, name })) return res.status(400).json({ error: 'User already exists' });
    if (name.length < 6 || name.length > 30) return res.status(400).json({ error: 'Name must be between 6 and 30 characters' });
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) === false) return res.status(400).json({ error: 'Invalid email address' });
    if (password.length < 6 || password.length > 30) return res.status(400).json({ error: 'Password must be between 6 and 30 characters' });
    
    const user = new User({ name, email, password: await bcrypt.hash(password, 10), role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User does not exist' });
    if (!await bcrypt.compare(password, user.password)) {
      res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.json({ token: token, name: user.name, email: user.email, role: user.role, id: user._id });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
