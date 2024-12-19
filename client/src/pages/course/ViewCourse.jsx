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
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
            setIsLoggedIn(response.data.isLoggedIn); // Cập nhật trạng thái đăng nhập
        } catch (err) {
            console.error('Failed to check authentication status:', err);
            setIsLoggedIn(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Kiểm tra trạng thái đăng nhập
        if (!isLoggedIn) {
            setError('Bạn phải đăng nhập để gửi phản hồi đối với khóa học.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/feedback/createCourseFeedback',
                { description, course_id },
                { withCredentials: true } // Gửi cookie của session
            );
            if (response.status === 201) {
                setMessage(response.data.details);
                setDescription('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                console.error('Server error:', err.response.data);
                setError(err.response.data.message || 'Đã xảy ra lỗi từ server.');
            } else {
                console.error('Error:', err.message);
                setError('Không thể kết nối đến server. Vui lòng thử lại.');
            }
        }
    };

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
            <div className="view-course-header-container">
                <div className="view-course-header">
                    <div className="view-course-left">
                        <div className="view-course-infor">
                            <h3>{courseData.course_name}</h3>
                            <p>{courseData.course_short_description}</p>
                        </div>
                    </div>
                    <div className="view-course-right">
                        <img className="course-image" src="/img/main_content/courses/Course1_1.svg" alt="" />
                        <div className="course-price">
                            <label htmlFor="joinCourse">Giá: {courseData.course_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</label>
                        </div>
                        <button id="joinCourse" className="view-course-btn-join" onClick={() => navigate(`/edu/payment?course_id=${course_id}`)}>
                            Tham Gia Ngay
                        </button>
                    </div>
                </div>
            </div>
            <div className="view-course-body">
                <div className="view-course-details">
                    <h3>Thông tin khoá học:</h3>
                    <p>{courseData.course_full_description}</p>

                    <h3>Thông tin nhà cung cấp khoá học:</h3>
                    <ul className="view-course-detail">
                        <li>Tên tài khoản: {courseData.user_full_name}</li>
                        <li>Email: {courseData.user_email}</li>
                        <li>Số điện thoại: {courseData.user_phone_number}</li>
                    </ul>

                    <h3>Thời gian dự kiến: {courseData.course_duration}</h3>

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
            <div className='footer-course'>
                <div className="feedback-right">
                    <h3>Liên hệ ngay với chúng tôi nếu bạn cần hỗ trợ. ^^</h3>
                    <form className='feedback-form' onSubmit={handleSubmit}>
                            <div className='feedback-form-group'>
                                <input type='text' 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Trình bày vấn đề của bạn tại đây!'/>
                            </div>
                            <div className='feedback-form-group'>
                                <button>YÊU CẦU HỖ TRỢ</button>
                            </div>
                    </form>
                    {message && <div className="feedback-success">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default ViewCourse;
