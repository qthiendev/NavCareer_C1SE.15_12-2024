import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ESPNav from './ESPNav'; // Import ESPNav
import './ViewAllCourse.css';

const ViewAllCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [banChecked, setBanChecked] = useState(false);

    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/admin/user/ban/check?procedure_name=ReadUserCourses',
                    { withCredentials: true }
                );
                setBanChecked(true);
            } catch (error) {
                alert('BANNED');
                navigate(-1);
            }
        };

        checkBanStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!banChecked) return;

            try {
                const response = await axios.get(
                    'http://localhost:5000/esp/course/read-all',
                    { withCredentials: true }
                );
                setCourses(response.data.courses || []);
            } catch (err) {
                setError('Không thể lấy danh sách khóa học. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [banChecked]);

    const handleEdit = (course_id) => {
        navigate(`/esp/course/${course_id}/update`);
    };

    const handleDelete = async (course_id) => {
        try {
            const response = await axios.post(`http://localhost:5000/course/delete?course_id=${course_id}`, 
                {}, { withCredentials: true });

            if (response.status === 200) {
                alert('Xóa khóa học thành công!');
                setCourses(courses.filter((course) => course.course_id !== course_id));
            } else {
                alert('Xóa khóa học thất bại!');
            }
        } catch (err) {
            alert(`Failed to delete course: ${err.message}`);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (courses.length === 0) return <div>Không có khóa học nào.</div>;

    return (
        <div id="view-all-course">
            <ESPNav /> {/* Sử dụng ESPNav */}
            <h2>Danh sách Khóa học</h2>
            <button
                className="btn-add"
                onClick={() => navigate(`/esp/course/create`)}
            >
                Add Course
            </button>
            <table className="course-table">
                <thead>
                    <tr>
                        <th>ID Khóa học</th>
                        <th>Tên Khóa học</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>
                                <Link
                                    to={`/course/${course.course_id}`}
                                    className="course-link"
                                >
                                    {course.course_name}
                                </Link>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(course.course_id)}>Chỉnh sửa</button>
                                <button onClick={() => handleDelete(course.course_id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAllCourse;
