import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewCourse.css';

function ViewCourse() {
    const { course_id } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatable, setUpdatable] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/course/read?course_id=${course_id}`, { withCredentials: true });
                setCourseData(response.data);
            } catch (error) {
                console.error('Failed to fetch course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [course_id]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (courseData && courseData.user_id) {
                    setUpdatable(response.data.aid === Number.parseInt(courseData.user_id, 10));
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        if (courseData) {
            checkAuth();
        }
    }, [courseData]);

    if (loading) {
        return <p>Loading course details...</p>;
    }

    if (!courseData) {
        return <p>Failed to load course details.</p>;
    }

    return (
        <div className="view-course-container">
            <h1>{courseData.course_name}</h1>
            <p><strong>Nhà cung cấp:</strong> {courseData.user_full_name}</p>
            <p><strong>Email:</strong> {courseData.user_email}</p>
            <p><strong>Số điện thoại:</strong> {courseData.user_phone_number}</p>
            <p><strong>Mô tả:</strong> {courseData.course_full_description}</p>
            <p><strong>Giá:</strong> {courseData.course_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            <p><strong>Thời gian dự kiến:</strong> {courseData.duration}</p>

            <h3>Các module:</h3>
            <ul>
                {courseData.modules.map((module, index) => (
                    <li key={`${module.module_ordinal}-${module.module_name}-${index}`}>
                        {module.module_ordinal + 1}. {module.module_name}
                    </li>
                ))}
            </ul>

            <button className="btn-join" onClick={() => navigate(`/edu/payment?course_id=${course_id}`)}>
                Tham gia ngay
            </button>

            {updatable && (
                <button className="btn-edit" onClick={() => navigate(`/esp/course/${course_id}/update`)}>
                    Edit Course
                </button>
            )}
        </div>
    );
}

export default ViewCourse;
