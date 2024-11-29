import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./ListCourseFeedback.css";

const FeedbackCourse = () => {
    const { courseId, courseName } = useParams();
    const [enrollData, setEnrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [feedbacks, setFeedbacks] = useState([])
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
        const vietnamDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

        // Định dạng ngày giờ theo kiểu Việt Nam
        const formattedDate = vietnamDate.toLocaleString("vi-VN");
        return formattedDate;
    }

    useEffect(() => {
        const fetchEnrollData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:5000/feedback/readCourseFeedback?courseId=${courseId}`,
                    { credentials: 'include' }
                );
                const data =response.data
                console.log('data',data);
                
                setFeedbacks(data)

                if (!response.ok) {
                    throw new Error(`Failed to fetch enroll data: ${response.statusText}`);
                }
                const result = await response.json();
                setEnrollData(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrollData();
    }, [courseId]);

    if (isLoading) return <p className="loading-message">Đang tải dữ liệu...</p>;
    if (error) return <p className="error-message">Lỗi: {error}</p>;
    if (enrollData.length === 0) return <p className="no-data-message">Không có dữ liệu ghi danh nào.</p>;

    return (
        <div className="admin-home">
            <div className="enroll-data">
                <button className="back-button" onClick={() => navigate(-1)}>Trước</button>
                <h3 className="report-title">Danh sách phản hồi khóa học</h3>
                <h2 className="course-name-title">Khóa Học: {courseName}</h2>
                {feedbacks.length > 0 ? (
                            feedbacks.map((feedback, index) => (
                                <div key={index} className="admin-feedback-item">
                                    <p>Feedback {index + 1}</p>
                                    <p>Người Tạo: {feedback.user_full_name===null?"Khách":  feedback.user_full_name} </p>
                                    <p>Nội dung: {feedback.feedback_description}</p>
                                    <p>Ngày tạo: {formatDate(feedback.feedback_date)}</p>
                                </div>
                            ))
                        ):(
                            <p>No feedbacks found.</p>
                        )}
            </div>
        </div>
    );
};

export default FeedbackCourse;
