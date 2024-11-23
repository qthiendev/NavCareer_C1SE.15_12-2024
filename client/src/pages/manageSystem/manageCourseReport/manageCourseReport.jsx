import { useState, useEffect } from "react";
import "./ManageCourseReport.css";

const ManageCourseReport = () => {
    const [courseData, setCourseData] = useState([]);
    const [enrollData, setEnrollData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    "http://localhost:5000/report/ManageCoursesReport",
                    { credentials: 'include' } // Gửi cookie cùng request nếu cần
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();
                setCourseData(result.data || []); // Xử lý khi `data` không tồn tại
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    
    const fetchEnrollData = async (course_id,course_name) => {
        setSelectedCourseName(course_name);
        setIsLoading(true);
        try {
            
            const url = `http://localhost:5000/report/GetUserEnroll?course_id=${course_id}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Gửi cookie nếu cần
            });

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

    if (isLoading) {
        return <p>Đang tải dữ liệu...</p>;
    }
    if (error) {
        return <p>Lỗi: {error}</p>;
    }

    if (courseData.length === 0) {
        return <p>Không có dữ liệu khóa học nào.</p>;
    }

    // Tính tổng doanh thu của các khóa học "Hoàn thành"
    const totalRevenue = courseData
        .reduce((sum, course) => sum + course.course_price, 0);

    return (
        <div className="admin-home">
            
            <div className="course-report">
                <h2 className="report-title">Báo Cáo Khóa Học</h2>
                <ul className="esp-nav">
                    <li><a href="/esp">Trang chủ ESP</a></li>
                    <li><a href="/">Trang chủ Hệ thống</a></li>
                    <li><a href="/esp/course/view-all">Thông tin khóa học</a></li>
                    <li><a href="/esp/ManageCourseReport">Báo cáo khóa học</a></li>
                </ul>
                <table className="course-table" border="1">
                    <thead>
                        <tr className="table-header">
                            <th className="table-content">Tên Khóa Học</th>
                            <th className="table-content">Người Tham Gia</th>
                            <th className="table-content">Đơn giá (VND)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseData.map((course) => (
                            <tr className="table-row" key={course.course_id}>
                                <td className="table-content"
                                    style={{ cursor: "pointer", color: "grey" }}
                                    onClick={() => fetchEnrollData(course.course_id, course.course_name)}
                                >{course.course_name}</td>
                                <td className="table-content">{course.NumberOfParticipants}</td>
                                <td className="table-content">{course.course_price.toLocaleString("vi-VN")} VND</td>
                            </tr>
                        ))}
                        <tr>
                            <td className="table-content" colSpan="2" style={{ fontWeight: "bold", textAlign: "right" }}>
                                Tổng Doanh Thu (Hoàn thành):
                            </td >
                            <td className="table-content" style={{ fontWeight: "bold" }}>
                                {totalRevenue.toLocaleString("vi-VN")} VND
                            </td>
                        </tr>
                    </tbody>
                </table>
                {enrollData.length > 0 && (
                <div className="enroll-data">
                    <h3>Danh sách người ghi danh</h3>
                    <h2 className="course-name-title">Khóa Học: {selectedCourseName}</h2>
                    <table className="enroll-table" border="1">
                        <thead>
                            <tr>
                                <th className="table-content-header">Tên Sinh Viên</th>
                                <th className="table-content-header">Email</th>
                                <th className="table-content-header">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollData.map((user, index) => (
                                <tr key={index}>
                                    <td className="table-nav-content">{user.StudentName}</td>
                                    <td className="table-nav-content">{user.Email}</td>
                                    <td className="table-nav-content">{user.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    );
};

export default ManageCourseReport;
