import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

function Payment() {
    const navigate = useNavigate();
    const [authCheck, setAuthCheck] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [courseCheck, setCourseCheck] = useState(false);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const course_id = searchParams.get('course_id');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (!response.data.sign_in_status) {
                    alert('Đăng nhập để tiếp tục');
                    navigate('/signin');
                } else {
                    setAuthCheck(true);
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!course_id || !authCheck) return;
            try {
                const response = await axios.get(`http://localhost:5000/course/read?course_id=${course_id}`, { withCredentials: true });
                setCourseData(response.data);
                setCourseCheck(true);
            } catch (error) {
                console.error('Failed to fetch course data:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [authCheck, course_id, navigate]);

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            if (!courseCheck || !course_id || !authCheck) return;
            try {
                const response = await axios.get(`http://localhost:5000/edu/read-enroll-of?course_id=${course_id}`, { withCredentials: true });
                if (response.status === 200) {
                    alert('Bạn đã tham gia khóa học này!');
                    navigate(`/edu/collection?c=${course_id}&m=0&co=0`);
                }
            } catch (error) {
                console.error('Failed to fetch enrollment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollmentData();
    }, [authCheck, courseCheck, course_id, navigate]);

    const handlePayment = async (course_id) => {
        try {
            const response = await axios.post(`http://localhost:5000/edu/payment/create?course_id=${course_id}`, {}, { withCredentials: true });
            window.location.href = response.data.orderurl;
        } catch (err) {
            console.error('Failed to create payment:', err);
        }
    };

    if (loading) {
        return <div className="payment__loading">Đang tải...</div>;
    }

    if (!courseData) {
        return <div className="payment__container">Không tìm thấy dữ liệu khóa học.</div>;
    }

    return (
        <div className='payment__container'>
            <p><strong>Tên khóa học:</strong> {courseData.course_name}</p>
            <p><strong>Nhà cung cấp:</strong> {courseData.user_full_name}</p>
            <p><strong>Giá:</strong> {courseData.course_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
            <p><strong>Thời gian dự kiến:</strong> {courseData.course_duration}</p>

            <button className='payment__button--pay' onClick={() => handlePayment(course_id)}>
                Thanh toán ngay
            </button>
        </div>
    );
}

export default Payment;
