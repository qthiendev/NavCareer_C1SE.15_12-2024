import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './coursesList.css'

const CoursesList = ({ fieldName }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Call API to get courses by field name
        const response = await axios.post('http://localhost:5000/chatbot/GetCourse', {
          fieldName: fieldName,
        });

        if (response.data.courses && response.data.courses.length > 0) {
          setCourses(response.data.courses);
        } else {
          setError(response.data.message || 'Không tìm thấy khóa học nào trong lĩnh vực này.');
        }
      } catch (err) {
        console.error('Lỗi khi gọi API:', err);
        setError('Có lỗi xảy ra khi kết nối với hệ thống.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [fieldName]);

  if (loading) return <p>Đang tải danh sách khóa học...</p>;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="courses-list">
      <h3 className="field-name">Danh sách khóa học cho lĩnh vực: {fieldName}</h3>
      <div className="cards-container">
        {courses.map((course) => (
          <div key={course.course_id} className="course-card">
            <Link to={`/course/${course.course_id}`} className="course-link">
              <img src='/img/student_profile/c_2.png' className="course-image" />
              <h4 className="course-name">{course.course_name}</h4>
              <p className="course-description">{course.course_short_description}</p>
              <p className="course-price">Giá: {course.course_price.toLocaleString()} VNĐ</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesList;