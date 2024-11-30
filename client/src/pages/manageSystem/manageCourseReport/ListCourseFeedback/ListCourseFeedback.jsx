import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./ListCourseFeedback.css";

const FeedbackCourse = () => {
    const { courseId, courseName } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
        const vietnamDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

        // Định dạng ngày giờ theo kiểu Việt Nam
        return vietnamDate.toLocaleString("vi-VN");
    };

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:5000/feedback/readCourseFeedback?courseId=${courseId}`,
                    { credentials: 'include' }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch feedback data: ${response.statusText}`);
                }

                const result = await response.json();
                setFeedbacks(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedbackData();
    }, [courseId]);

    if (isLoading) return <p className="loading-message">Đang tải dữ liệu...</p>;
    if (error) return <p className="error-message">Lỗi: {error}</p>;
    if (feedbacks.length === 0) return <p className="no-data-message">Không có phản hồi nào cho khóa học này.</p>;

    return (
        <div className="admin-home">
            <div className="feedback-data">
                <button className="back-button" onClick={() => navigate(-1)}>Trước</button>
                <h1 className="report-title">Danh sách phản hồi khóa học</h1>
                <h2 className="course-name-title">Khóa Học: {courseName}</h2>
                {feedbacks.map((feedback, index) => (
                    <div key={index} className="admin-feedback-item">
                        <p>Phản hồi {index + 1}</p>
                        <p>Người tạo: {feedback.user_full_name || "Khách"} </p>
                        <p>Nội dung: {feedback.feedback_description}</p>
                        <p>Ngày tạo: {formatDate(feedback.feedback_date)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackCourse;
