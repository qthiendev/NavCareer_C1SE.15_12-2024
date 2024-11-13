import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Accomplishment.css';

function Accomplishment() {
    const { certificate_id } = useParams();
    const [accomplishmentData, setAccomplishmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccomplishment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/edu/get-accomplishment?certificate_id=${certificate_id}`);
                if (response.status !== 200) {
                    alert("Không tìm thấy bằng với mã này");
                    navigate('/');
                }
                setAccomplishmentData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch accomplishment data:", error);
                setLoading(false);
            }
        };

        fetchAccomplishment();
    }, [certificate_id, navigate]);

    const exportPDF = async () => {
        const certificateElement = document.querySelector(".certificate-container");

        const canvas = await html2canvas(certificateElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        });

        const imageData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "px", "a4");
        pdf.addImage(imageData, "PNG", 20, 20, pdf.internal.pageSize.getWidth() - 40, 0);
        pdf.save(`certificate_${certificate_id}.pdf`);
    };

    if (loading) return <div>Loading...</div>;

    if (!accomplishmentData) return <div>No accomplishment data found.</div>;

    const { provider_name, student_name, course_name, user_gender, accomplishment_certificate_id, course_id, provider_id, student_id } = accomplishmentData;
    const genderPrefix = user_gender ? 'Mr.' : 'Ms.';

    return (
        <div className="accomplishment-container">
            <div className="certificate-container" id="certificate">
                <div className="certificate-body">
                    
                    <div className="seal"></div>

                    <h1>GIẤY CHỨNG NHẬN</h1>

                    <p>Được trao cho</p>

                    <h2 className="recipient-name">
                        {genderPrefix} {student_name}
                    </h2>

                    <p>để công nhận việc hoàn thành khóa học</p>
                    
                    <h3 className="course-name">{course_name}</h3>

                </div>

                <div className="certificate-footer">
                    <div className="signatures">
                        <div className="signature">
                            
                            <p>Nhà cung cấp khóa học</p>

                            <img
                                className="signature-img"
                                src="https://static.vecteezy.com/system/resources/thumbnails/000/537/670/small_2x/4153.jpg"
                                alt="Signature 1"
                                crossorigin="anonymous"
                            />
                            <p>{provider_name}</p>
                        </div>

                        <div className="signature">
                            <p>Đại diện NavCareer</p>
                            <img
                                className="signature-img"
                                src="https://cdn.prod.website-files.com/61d7de73eec437f52da6d699/62161cf7328ad280841f653f_esignature-signature.png"
                                alt="Signature 2"
                                crossorigin="anonymous"
                            />
                            <p>Trinh Quy Thien</p>
                        </div>

                    </div>

                    <p className="certificate-id">ID: {accomplishment_certificate_id}</p>

                </div>
            </div>

            <div className="navigation-buttons">
                <button onClick={() => navigate(`/course/${course_id}`)}>Thông tin khóa học</button>
                <button onClick={() => navigate(`/profile/${provider_id}`)}>Thông tin Nhà cung cấp</button>
                <button onClick={() => navigate(`/profile/${student_id}`)}>Thông tin Học viên</button>
                <button onClick={exportPDF}>Export as PDF</button>
            </div>
        </div>
    );
}

export default Accomplishment;
