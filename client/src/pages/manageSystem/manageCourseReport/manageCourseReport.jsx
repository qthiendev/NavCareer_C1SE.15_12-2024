import { useState, useEffect } from "react";
import "./ManageCourseReport.css";

const ManageCourseReport = () => {
    const [courseData, setCourseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    "http://localhost:5000/report/ManageCoursesReport"
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();
                setCourseData(result.data); // Accessing the "data" key
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (courseData.length === 0) {
        return <p>No course data available</p>;
    }

    // Tính tổng doanh thu
    const totalRevenue = courseData.reduce((sum, course) => sum + course.revenue, 0);

    return (
        <div className="admin-home">
            <ul className="admin-nav">
                <li><a href="/admin">Trang chủ Admin</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/admin/user/view-all">Thông tin Người dùng</a></li>
                <li><a href="/admin/user/function/general">Phân quyền Chung</a></li>
                <li><a href="/admin/user/function/esp">Phân quyền ESP</a></li>
                <li><a href="/admin/user/view-all">Phân quyền Student</a></li>
                <li><a href="/admin/course/view-all">Thông tin Khóa học</a></li>
                <li><a href="admin/ManageCourseReport">Báo cáo Khóa học</a></li>
                <li><a href="/admin/ManageStudentReport">Chi tiết học viên</a></li>

            </ul>
            <div className="course-report">
                <h2 className="report-title">Course Report</h2>
                <table className="course-table" border="1">
                    <thead>
                        <tr className="table-header">
                            <th className="table-content">Tên Khóa Học</th>
                            <th className="table-content">Người Tham Gia</th>
                            <th className="table-content">Đơn giá (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseData.map((course, index) => (
                            <tr className="table-row" key={index}>
                                <td className="table-content">{course.courseName}</td>
                                <td className="table-content">{course.participants}</td>
                                <td className="table-content">{course.revenue.toLocaleString("vi-VN")} VND</td>
                            </tr>
                        ))}
                        {/* Hàng tổng số tiền */}
                        <tr className="table-footer">
                            <td className="table-content" colSpan="2" style={{ fontWeight: "bold", textAlign: "right" }}>
                                Tổng doanh thu:
                            </td>
                            <td className="table-content" style={{ fontWeight: "bold" }}>
                                {totalRevenue.toLocaleString("vi-VN")} VND
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
    );
};

export default ManageCourseReport;
