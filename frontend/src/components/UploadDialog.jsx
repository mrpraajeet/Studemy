/* eslint-disable */
import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const UploadDialog = ({ open, onClose, onSubmit, selectedCourseId }) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTitleChange = (e) => {
    if (e.target.value.length <= 50) {
      setTitle(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = () => {
    if (title && selectedFile) {
      onSubmit(selectedCourseId, selectedFile, title);
      handleDialogClose();
    } else {
      alert('Please select a file and provide a title for it.');
    }
  };

  const handleDialogClose = () => {
    setTitle('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Upload course content</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={handleTitleChange}
          helperText={`${title.length}/50 characters`}
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'block', marginTop: '16px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleUploadSubmit} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
