/* eslint-disable */
import { useState, useEffect } from 'react';
import { getCourses, enrollCourse, deleteCourse, uploadFile, createOrder } from '../services/api';
import CourseTable from '../components/CourseTable';
import CreateDialog from '../components/CreateDialog';
import { Button } from '@mui/material';
import CountUp from 'react-countup';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [dialog, setDialog] = useState(false);
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const name = sessionStorage.getItem('name');
  const email = sessionStorage.getItem('email');
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses(token);
        setCourses(response.data);
        handleTotal(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch courses!');
      }
    };
    fetchCourses();
  }, [token]);

  const handleTotal = (courses) => {
    let enrollments = 0;
    let revenue = 0;

    courses.forEach(course => {
      enrollments += course.students.length;
      revenue += course.students.length * course.price * 0.9;
    });

    setTotalEnrollments(enrollments);
    setTotalRevenue(revenue);
  };

  const handleEnroll = async (courseId, price) => {
    try {
      if (price <= 0) {  
        await enrollCourse(courseId, token);
        alert("Enrolled in the course!.");
        window.location.reload();
        return;
      }

      const { order, orderToken } = (await createOrder(price, token)).data;
      console.log(order);
      if (!order || order.status !== 'created') {
        alert('Order creation failed!');
        return;
      }
  
      const options = {
        key: 'rzp_test_dIIKQ94GFsa1TJ',
        amount: order.amount,
        currency: 'INR',
        name: "Course Enrollment",
        description: `Enrolling in course ID: ${courseId}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await enrollCourse(courseId, token, orderToken);
            alert("Payment successful! Enrolled in the course.");
            window.location.reload();
          } catch (err) {
            console.error(err);
            alert("Payment succeeded, but enrollment failed!");
          }
        },
        prefill: {
          name: name,
          email: email,
        },
      };
      const razorpay = new Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", (response) => {
        alert("Payment failed! Please try again.");
        console.error("Payment failed:", response);
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to enroll!");
    }
  };
  

  const handleUpload = async (courseId, file, title) => {
    try {
      await uploadFile(courseId, file, title, token);
      alert('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to upload file!');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId, token);
      alert('Course deleted successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to delete course!');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 pt-4 md:pt-0">All Courses</h1>
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {role === 'instructor' && (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Total Enrollments:</span>
                <span className="text-lg font-bold text-blue-600">
                  <CountUp end={totalEnrollments} duration={3} />
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Total Revenue:</span>
                <span className="text-lg font-bold text-green-600">
                  ₹<CountUp end={totalRevenue} duration={3} decimals={2} />
                </span>
              </div>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setDialog(true)}
              >
                Create Course
              </Button>
              <CreateDialog 
                open={dialog} 
                onClose={() => {
                  setDialog(false)
                  window.location.reload();
                }}
              />
            </>
          )}
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <CourseTable
        courses={courses}
        onEnroll={role === 'student' ? handleEnroll : null}
        onUpload={role === 'instructor' ? handleUpload : null}
        onDelete={role === 'instructor' ? handleDelete : null}
        role={role}
      />
    </div>
  );
};

export default CoursesPage;
