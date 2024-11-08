import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCourse.css';

function CreateCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [courseShortDescription, setCourseShortDescription] = useState('');
    const [courseFullDescription, setCourseFullDescription] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [error, setError] = useState(null);
    const [banChecked, setBanChecked] = useState(false);
    const [espChecked, setESPChecked] = useState(false);
    
    // Check ban status
    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=CreateCourse', { withCredentials: true });
                setBanChecked(true);
            } catch (error) {
                console.error('Failed to check ban status:', error);
                alert('BANNED');
                navigate(-1);
            }
        };

        checkBanStatus();
    }, [navigate]);

    // Check authorization
    useEffect(() => {
        const checkAuthorization = async () => {
            if (!banChecked) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/'); // Redirect if not authorized
                }
                setESPChecked(true);
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [banChecked, navigate]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            course_name: courseName,
            course_short_description: courseShortDescription,
            course_full_description: courseFullDescription,
            course_duration: courseDuration,
            course_price: coursePrice,
        };

        try {
            const response = await axios.post('http://localhost:5000/course/create', formData, { withCredentials: true });
            if (response.status === 201 || response.status === 200) {
                navigate('/esp/course/view-all');
            }
        } catch (error) {
            console.error('Course creation failed:', error);
            setError('Failed to create course. Please try again.'); // Set error message
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    return (
        <div className="create-course-container">
            <div className="create-course-left-panel">
                <div className="create-course-header">
                    
                    <h2 className="create-course-name">NAV CAREER</h2> 
                    <h2 className="create-course-name">Thêm hồ sơ</h2>
                    {/* <button className="create-course-share-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="share-icon" />
                        Chia sẻ hồ sơ
                    </button> */}
                </div>
                <div className="create-course-menu">
                    <ul>
                        <li className="create-course-menu-item active">Hồ sơ người dùng</li>
                        <li className="create-course-menu-item">Các khoá học</li>
                        <li className="create-course-menu-item">Giảng viên yêu thích</li>
                        <li className="create-course-menu-item">Tin nhắn</li>
                        <li style={{ border: 'none' }} className="create-course-menu-item">Liên hệ admin</li>
                    </ul>
                </div>
            </div>

            <div className="create-course-right-panel">
                <div className="create-course-info">
                    <form onSubmit={handleSubmit}>
                        <div className="create-course-form">
                            <div className="create-course-form-row">
                                <div className="create-course-form-group">
                                    <label htmlFor="course_name">Tên khóa học: </label>
                                    <input
                                        type="text"
                                        id="course_name"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="create-course-form-group">
                                    <label htmlFor="course_short_description">Mô tả khóa học: </label>
                                    <input
                                        type="text"
                                        id="course_short_description"
                                        value={courseShortDescription}
                                        onChange={(e) => setCourseShortDescription(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="create-course-form-row">
                                <div className="create-course-form-group">
                                    <label htmlFor="course_full_description">Thông tin khóa học: </label>
                                    <textarea
                                        id="course_full_description"
                                        value={courseFullDescription}
                                        onChange={(e) => setCourseFullDescription(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="create-course-form-row">
                                <div className="create-course-form-group">
                                    <label htmlFor="course_price">Giá: </label>
                                    <input
                                        type="number"
                                        id="course_price"
                                        value={coursePrice}
                                        onChange={(e) => setCoursePrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="create-course-form-group">
                                    <label htmlFor="course_duration">Số giờ học: </label>
                                    <input
                                        type="text"
                                        id="course_duration"
                                        value={courseDuration}
                                        onChange={(e) => setCourseDuration(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="create-course-form-row">
                                <button type="submit">Tạo Khóa Học</button>
                            </div>
                            <div className="create-course-form-row">
                                <button className="create-course-black-btn" onClick={() => navigate('/esp/course/view-all')}>
                                    Tạo hồ sơ
                                </button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateCourse;
