import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "./ListCourseEnroll.css";

const EnrollData = () => {
    const { courseId, courseName } = useParams();
    const [enrollData, setEnrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEnrollData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `http://localhost:5000/report/GetUserEnroll?course_id=${courseId}`,
                    { credentials: 'include' }
                );
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
                <h3 className="report-title">Danh sách người ghi danh</h3>
                <h2 className="course-name-title">Khóa Học: {courseName}</h2>
                <table className="enroll-table" border="1">
                    <thead>
                        <tr className="table-header">
                            <th className="table-content-header">Tên Sinh Viên</th>
                            <th className="table-content-header">Email</th>
                            <th className="table-content-header">Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollData.map((user, index) => (
                            <tr key={index} className="table-row">
                                <td className="table-nav-content">{user.StudentName}</td>
                                <td className="table-nav-content">{user.Email}</td>
                                <td className="table-nav-content">{user.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollData;
