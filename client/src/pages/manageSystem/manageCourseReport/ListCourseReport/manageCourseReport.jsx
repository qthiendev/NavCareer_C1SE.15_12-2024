import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./ManageCourseReport.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ManageCourseReport = () => {
    const [courseData, setCourseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    "http://localhost:5000/report/ManageCoursesReport",
                    { credentials: "include" }
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.statusText}`);
                }
                const result = await response.json();
                setCourseData(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <p className="loading-message">Đang tải dữ liệu...</p>;
    if (error) return <p className="error-message">Lỗi: {error}</p>;
    if (courseData.length === 0)
        return <p className="no-data-message">Không có dữ liệu khóa học nào.</p>;

    const totalRevenue = courseData.reduce(
        (sum, course) => sum + course.course_price,
        0
    );

    // Prepare data for the bar chart
    const chartData = {
        labels: courseData.map((course) => course.course_name),
        datasets: [
            {
                label: "Số Người Tham Gia",
                data: courseData.map((course) => course.NumberOfParticipants),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: "y", // Horizontal bar chart
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.raw} người tham gia`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    stepSize: 5, // Increment by 5
                },
            },
        },
    };

    return (
        <div className="admin-home">
            <div className="course-report-header">
                    <h2 className="report-title">Báo Cáo Khóa Học</h2>
                    <ul className="esp-nav">
                        <li><a href="/esp">Trang chủ ESP</a></li>
                        <li><a href="/">Trang chủ Hệ thống</a></li>
                        <li><a href="/esp/course/view-all">Thông tin khóa học</a></li>
                        <li><a href="/esp/ManageCourseReport">Báo cáo khóa học</a></li>
                    </ul>
                </div>
            <div className="course-report">
                
                <table className="course-table" border="1">
                    <thead>
                        <tr className="table-header">
                            <th className="table-content">Tên Khóa Học</th>
                            <th className="table-content">Người Tham Gia</th>
                            <th className="table-content">Đơn giá (VND)</th>
                            <th className="table-content-header">Số Đánh Giá</th>

                        </tr>
                    </thead>
                    <tbody>
                        {courseData.map((course) => (
                            <tr
                                className="table-row"
                                key={course.course_id}
                            >
                                <td
                                    className="table-content"
                                    style={{ cursor: "pointer", color: "grey" }}
                                    onClick={() =>
                                        navigate(
                                            `/esp/ManageCourseReport/enroll/${course.course_id}/${course.course_name}`
                                        )
                                    }
                                >
                                    {course.course_name}
                                </td>
                                <td className="table-content">
                                    {course.NumberOfParticipants}
                                </td>
                                <td className="table-content">
                                    {course.course_price.toLocaleString(
                                        "vi-VN"
                                    )}{" "}
                                    VND
                                </td>
                                <td className="table-content"
                                style={{ cursor: "pointer", color: "grey" }}
                                onClick={() =>
                                    navigate(
                                        `/esp/ManageCourseReport/courseFeedback/${course.course_id}/${course.course_name}`
                                    )
                                }>
                                    {course.NumberOfFeedback}
                                  
                                </td>

                            </tr>
                        ))}
                        <tr>
                            <td
                                className="table-content"
                                colSpan="2"
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "right",
                                }}
                            >
                                Tổng Doanh Thu (Hoàn thành):
                            </td>
                            <td
                                className="table-content"
                                style={{ fontWeight: "bold" }}
                            >
                                {totalRevenue.toLocaleString("vi-VN")} VND
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="chart-container">
                    <h3>Biểu Đồ Tham Gia Khóa Học</h3>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default ManageCourseReport;
