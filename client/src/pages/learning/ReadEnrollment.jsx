import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReadEnrollment.css';

const ReadEnrollment = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/edu/read-enroll', { withCredentials: true });
                setEnrollments(response.data.enrollments);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu đăng ký:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    // Format date as dd-mm-yyyy with zero padding
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (loading) {
        return <div className="read-enrollment__loading">Đang tải...</div>;
    }

    return (
        <div className="read-enrollment">
            <h1>Danh Sách Đăng Ký</h1>
            {(!enrollments || enrollments.length === 0) ? (
                <div className="read-enrollment__no-enrollments">
                    Bạn chưa đăng ký bất kỳ khóa học nào!
                </div>
            ) : (
                <div className="read-enrollment__list">
                    {enrollments.map((enrollment) => (
                        <div
                            key={enrollment.enrollment_id}
                            className="read-enrollment__card"
                            onClick={() =>
                                window.location.href = `/edu/collection?c=${enrollment.course_id}&m=0&co=0`
                            }
                        >
                            <span className="read-enrollment__course-name">{enrollment.course_name}</span>
                            <div className="read-enrollment__details">
                                <span className="read-enrollment__price">{enrollment.course_price.toLocaleString()} VND</span>
                                <span className="read-enrollment__date">{formatDate(enrollment.enrollment_date)}</span>
                                <span
                                    className={`read-enrollment__status ${enrollment.enrollment_is_complete ? 'complete' : 'in-progress'}`}
                                >
                                    {enrollment.enrollment_is_complete ? 'Hoàn Thành' : 'Đang Học'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReadEnrollment;
