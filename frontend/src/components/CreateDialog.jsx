/* eslint-disable */
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { createCourse } from '../services/api';

const CreateDialog = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 500) {
      setDescription(e.target.value);
    }
  };

  const handleSubmit = async () => {
    try {
      const courseData = { title, description, price };
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert("You're not authorized to create courses.");
        return;
      }
      await createCourse(courseData, token);
      alert('Course created successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to create course. Please try again later.');
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Course</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          placeholder="Enter the course title"
          fullWidth
          value={title}
          onChange={handleTitleChange}
          helperText={`${title.length}/50 characters`}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          placeholder="Enter the description of the course, Include necessary keywords."
          fullWidth
          multiline
          rows={6}
          value={description}
          onChange={handleDescriptionChange}
          helperText={`${description.length}/500 characters`}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          placeholder="Enter course price in Rupees, 0 for free."
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          helperText="Platform fee of 10% will be deducted from your revenue."
          InputProps={{inputProps: { step: 50, min: 0 }}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!title || !description}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDialog;
