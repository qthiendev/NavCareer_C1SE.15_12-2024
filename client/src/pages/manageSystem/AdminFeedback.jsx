import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminFeedback.css';
import { useNavigate } from "react-router-dom";

const AdminFeedback = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');
    const [Loading, setLoading] = useState(true);   
    const [isAuthz, setAuthz] = useState(false);


    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200) navigate('/');
                setAuthz(true);
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };
        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try{
                const response = await axios.get('http://localhost:5000/feedback/readFeedback');
                const data = response.data.data;
                setFeedbacks(data);
                setLoading(false);
            }catch(error){
                setError(error.message);
                setLoading(false);
            }
        };
        if (isAuthz) fetchFeedbacks();
    }, [isAuthz]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
        const vietnamDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

        // Định dạng ngày giờ theo kiểu Việt Nam
        const formattedDate = vietnamDate.toLocaleString("vi-VN");
        return formattedDate;
    }

    if (Loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="admin-feedback">
            <div className="admin-home">
                <ul className="admin-nav">
                    <li><a href="/admin">Trang chủ Admin</a></li>
                    <li><a href="/">Trang chủ Hệ thống</a></li>
                    <li><a href="/admin/user/view-all">Thông tin Người dùng</a></li>
                    <li><a href="/admin/user/function/general">Phân quyền Chung</a></li>
                    <li><a href="/admin/user/function/esp">Phân quyền ESP</a></li>
                    <li><a href="/admin/user/view-all">Phân quyền Student</a></li>
                    <li><a href="/admin/course/view-all">Thông tin Khóa học</a></li>
                    <li><a href="/admin/feedback">Phản hồi hệ thống</a></li>
                </ul>
            
                <div className="admin-feedback-container">
                    <div className="admin-feedback-header">
                        <h1>Feedback</h1>
                    </div>
                    <div className="admin-feedback-content">
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
            </div>
        </div>
    )
}

export default AdminFeedback
