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
            <div className='view-course-left'>
                <div className='view-course-infor'>
                    <h3>{courseData.course_name}</h3>
                    <p>Thêm giới thiệu ngắn gọn cho khoá học tại đây!!!</p>
                </div>
                <div className='view-course-intro'>
                    <img src="/img/main_content/courses/Course1_1.svg" alt="" />
                </div>
                <div className='view-course-description'>
                    <h3>Thông tin khoá học:</h3>
                    <p>{courseData.course_full_description}</p>
                </div>
                <div className='view-course-esp'>
                    <p>Thông tin nhà cung cấp khoá học:</p>
                    <ul className='view-course-detail'>
                        <li>Tên tài khoản: {courseData.user_full_name}</li>
                        <li>Email: {courseData.user_email}</li>
                        <li>Số điện thoại: {courseData.user_phone_number}</li>
                    </ul>
                </div>
                <div className='view-course-duration'>
                    <p>Thời gian dự kiến: {courseData.duration}</p>
                </div>
                <div className='view-course-lesson'>
                    <h3>Giáo trình:</h3>
                    <ul>
                        {courseData.modules.map((module, index) => (
                            <li key={`${module.module_ordinal}-${module.module_name}-${index}`}>
                                {module.module_ordinal + 1}. {module.module_name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='view-course-right'>
                {/* <img src={courseData.course_image} alt="Hình ảnh khóa học" /> */}
                <img className='course-image' src="/img/main_content/courses/Course1_1.svg" alt="" />
                <div className="course-price">
                    <label htmlFor="joinCourse">Giá: {courseData.course_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</label>
                </div>
                <button id="joinCourse" className="view-course-btn-join" onClick={() => navigate(`/edu/payment?course_id=${course_id}`)}>
                    Tham Gia Ngay
                </button>
            </div>
        </div>   
    );
}

export default ViewCourse;
