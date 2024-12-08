import razorpay from 'razorpay';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const razor = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const verifyToken = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization?.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.body.amount <= 0) return res.status(204).send();
    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
    };
    const order = await razor.orders.create(options);
    const orderToken = jwt.sign({ id: order.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ order, orderToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

export default router;
export { razor };