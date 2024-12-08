import { Router } from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import { razor } from './order.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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

router.get('/', verifyToken, async (req, res) => {
  try {
    res.json(await Course.find().populate('instructor', 'name'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'instructor') return res.status(403).json({ error: 'Only instructors can create courses' });
    const { title, description, price } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Title and Description are required' });

    const instructor = await User.findById(req.user.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    const course = new Course({ title, description, price: price || 0, instructor: req.user.id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/enroll', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') 
      return res.status(403).json({ error: 'Only students can enroll in courses' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (course.students.includes(req.user.id))
      return res.status(400).json({ error: 'You are already enrolled in this course' });

    const orderToken = req.body.orderToken;
    if (!orderToken) return res.status(400).json({ error: 'Order token is required' });

    let orderId;
    try {
      orderId = jwt.verify(orderToken, process.env.JWT_SECRET).id;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid order token' });
    }

    const order = await razor.orders.fetch(orderId);
    if (!order) return res.status(400).json({ error: 'Order not found' });
    if (order.status !== 'paid' || order.amount !== course.price * 100) 
      return res.status(400).json({ error: 'Payment is not complete' });

    course.students.push(req.user.id);
    await course.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (req.user.id !== course.instructor.toString()) 
      return res.status(403).json({ error: 'Only course instructor can upload files' });

    const { buffer } = req.file;
    const { title } = req.body;
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'courses', resource_type: 'auto' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
        }

        course.content.push({ title, url: result.secure_url });
        await course.save();
        res.json({ message: 'File uploaded successfully', url: result.secure_url });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (req.user.id !== course.instructor.toString()) return res.status(403).json({ error: 'Only course instructor can delete their course' });

    const deletePromises = course.content.map(async (item) => {
      const publicId = 'courses/' + item.url.split('/').pop().split('.')[0];
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
export { verifyToken };