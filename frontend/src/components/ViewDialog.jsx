/* eslint-disable */
import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, Link } from '@mui/material';
import { getCourse } from '../services/api';

const ViewDialog = ({ open, onClose, courseId }) => {
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchCourse = async () => {
        try {
          const fetchedCourse = (await getCourse(courseId, sessionStorage.getItem('token'))).data;
          setCourse(fetchedCourse);
          setIsEnrolled(fetchedCourse.students.includes(sessionStorage.getItem('id')));
        } catch (error) {
          console.error(error);
          alert('Failed to fetch course content!');
        }
      };
      fetchCourse();
    }
  }, [open, courseId]);

  if (!course) {
    return null;
  }

  return (
    <Dialog 
  open={open} 
  onClose={onClose} 
  sx={{ 
    '& .MuiDialog-paper': { 
      padding: 2, 
      maxWidth: '600px', 
      width: '90%' 
    } 
  }}
>
  <DialogTitle 
    sx={{ 
      fontWeight: 'bold', 
      textAlign: 'left', 
      color: 'primary.main', 
      marginBottom: 2
    }}
  >
    {course.title}
  </DialogTitle>
  <DialogContent>
    <List 
      sx={{ 
        padding: 0, 
        '& .MuiListItem-root': { 
          padding: 1, 
          borderBottom: '1px solid #e0e0e0', 
          '&:last-child': { 
            borderBottom: 'none' 
          }, 
          '&:hover': { 
            backgroundColor: 'rgba(0, 0, 0, 0.04)' 
          }, 
          display: 'flex', 
          alignItems: 'flex-start'
        } 
      }}
    >
      {course.content.map((item, index) => (
        <ListItem 
          key={index} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: 2
          }}
        >
          <ListItemText 
            primary={item.title} 
            sx={{ 
              flex: 1, 
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }} 
          />
          {isEnrolled && (
            <Link 
              href={item.url} 
              target="_blank" 
              rel="noopener" 
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none', 
                '&:hover': { textDecoration: 'underline' }, 
                minWidth: '60px',
                textAlign: 'center' 
              }}
            >
              View
            </Link>
          )}
        </ListItem>
      ))}
    </List>
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={onClose} 
      variant="contained" 
      color="primary" 
      sx={{ textTransform: 'none' }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

)};

export default ViewDialog;
