import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import './ViewAllCourse.css'; // Import the CSS file for this component

const ViewAllCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/esp/course/read-all', { withCredentials: true });
                setCourses(response.data.courses || []);
            } catch (err) {
                setError('Không thể lấy danh sách khóa học. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleEdit = (course_id) => {
        navigate(`/esp/course/${course_id}/update`);
    };

    const handleDelete = async (course_id) => {
        try {
            await axios.delete('http://localhost:5000/course/delete', {
                data: { course_id },
                withCredentials: true
            });
            setCourses(courses.filter(course => course.course_id !== course_id));
            alert(`Course with ID: ${course_id} deleted successfully.`);
        } catch (err) {
            alert(`Failed to delete course: ${err.message}`);
        }
    };
    

    if (loading) return <div>Đang tải...</div>;
    if (courses.length === 0) return <div>Không có khóa học nào.</div>;

    return (
        <div id="view-all-course">
            <h2>Danh sách Khóa học</h2>
            <table className="course-table">
                <thead>
                    <tr>
                        <th>ID Khóa học</th>
                        <th>Tên Khóa học</th>
                        <th>Giá</th>
                        <th>Thời gian</th>
                        <th>Tổng số Module</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>
                                <Link to={`/course/${course.course_id}`} className="course-link">
                                    {course.course_name}
                                </Link>
                            </td>
                            <td>{course.course_price}</td>
                            <td>{course.duration}</td>
                            <td>{course.total_module}</td>
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
