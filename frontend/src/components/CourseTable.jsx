/* eslint-disable */
import { useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import UploadDialog from '../components/UploadDialog';
import ViewDialog from '../components/ViewDialog';

const CourseTable = ({ courses, role, onEnroll, onUpload, onDelete }) => {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleUploadDialogOpen = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenUploadDialog(true);
  };

  const handleViewDialogOpen = (courseId) => {
    setSelectedCourseId(courseId);
    setOpenViewDialog(true);
  };

  const rows = courses.map((course, index) => ({
    id: course._id,
    sNo: index + 1,
    title: course.title,
    description: course.description,
    instructor: course.instructor?.name || 'Unknown',
    price: course.price,
    enrolled: course.students.length
  }));

  const columns = [
    { 
      field: 'sNo', 
      headerName: 'S.No', 
      width: 70,
      renderCell: (params) => (
        <div style={{ padding: '8px'}}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal', 
          wordWrap: 'normal', 
          padding: '8px',
        }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'normal', 
          wordWrap: 'normal', 
          padding: '8px',
        }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'instructor',
      headerName: 'Instructor',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'normal', 
          wordWrap: 'normal',
          padding: '8px',
        }}>
          {params.value}
        </div>
      ),
    },
    { 
      field: 'enrolled', 
      headerName: 'Enrollments', 
      flex: 1, 
      minWidth: 100, 
      renderCell: (params) => (
        <div style={{ padding: '8px' }}>
          {params.value}
        </div>
      ),
    },
    { 
      field: 'price', 
      headerName: 'Price (in ₹)', 
      flex: 1, 
      minWidth: 100, 
      renderCell: (params) => (
        <div style={{ padding: '8px' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '8px'
        }}>
          {role === 'student' && (
            <div>
              <Button
                style={{ marginRight: '8px' }}
                variant="outlined"
                size="small"
                onClick={() => onEnroll(params.row.id, params.row.price)}
              >
                Enroll
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleViewDialogOpen(params.row.id)}
              >
                View
              </Button>
            </div>
          )}
          {role === 'instructor' && (
            <div>
              <Button
                style={{ marginRight: '8px' }}
                variant="outlined"
                size="small"
                onClick={() => handleUploadDialogOpen(params.row.id)}
              >
                Upload
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={() => onDelete(params.row.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={(params) => 'auto'}
      />

      <UploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onSubmit={onUpload}
        selectedCourseId={selectedCourseId}
      />
      
      <ViewDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        courseId={selectedCourseId}
      />
    </div>
  );
};

export default CourseTable;
