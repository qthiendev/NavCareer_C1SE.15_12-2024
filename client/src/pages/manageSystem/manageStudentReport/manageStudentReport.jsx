import { useState, useEffect } from 'react';
import './ManageStudentReport.css';

function ManageStudentReport() {
    const [user, setUser] = useState(null); // To store user data
    const [reports, setReports] = useState([]); // To store report data
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch data from API
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const userResponse = await fetch('/api/user'); // Replace with actual user API endpoint
                const reportsResponse = await fetch('/api/reports'); // Replace with actual reports API endpoint

                const userData = await userResponse.json();
                const reportsData = await reportsResponse.json();

                setUser(userData);
                setReports(reportsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading state
    }

    return (
        <div className="manage-student-report-container">
            <div className="manage-student-report-content">
                {/* User Information Section */}
                <div className="manage-student-report-user">
                    <div className="manage-student-report-user-avatar">
                        <img src={user?.avatar || 'default-avatar.png'} alt={`${user?.name}'s Avatar`} />
                    </div>
                    <div className="manage-student-report-user-info">
                        <div className="manage-student-report-user-name">
                            <span>{user?.name || 'No Name Available'}</span>
                        </div>
                        <div className="manage-student-report-user-details">
                            <p>{user?.email || 'No Email Available'}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="manage-student-report-table">
                    <table className="manage-student-report-table-content">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Subject</th>
                                <th>Score</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report, index) => (
                                    <tr key={report.id}>
                                        <td>{index + 1}</td>
                                        <td>{report.subject}</td>
                                        <td>{report.score}</td>
                                        <td>{report.remarks}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No reports available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageStudentReport;
