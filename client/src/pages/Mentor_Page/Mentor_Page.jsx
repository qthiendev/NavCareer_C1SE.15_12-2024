// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './Mentor_Page.css';
import mentor from './assets/Ellipse 4.png';

const Mentor_Page = () => {
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mentor'); // Ensure this URL matches your API's endpoint
        if (response.status === 200) {
          const data = await response.json();
          setMentorData(data);
        } else if (response.status === 203) {
          setError("Operation failed."); // Handle specific error message
        } else if (response.status === 500) {
          setError("Server error, please contact the backend."); // Handle server error
        } else {
          throw new Error("An unknown error occurred.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mentor-page">
      <div className="profile-section">
        <img 
          src={mentor} 
          alt="Emily Johnson" 
          className="profile-image" 
        />
        <div className="profile-info">
          <h2 className="mentor-name">{mentorData?.name || "Emily Johnson"}</h2>
          <p className="mentor-title">{mentorData?.title || "Nhà thiết kế UI/UX"}</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Lượt đăng ký:</span>
              <span className="stat-value">{mentorData?.registrations || 500}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Lượt review:</span>
              <span className="stat-value">{mentorData?.reviews || "40,445"}</span>
            </div>
          </div>
          <div className="social-links">
            <button className="social-button">Website</button>
            <button className="social-button">Twitter</button>
            <button className="social-button">Youtube</button>
          </div>
        </div>
      </div>

      <div className="details-section">
        <div className="intro">
          <h3>Giới thiệu</h3>
          <p>
            Với hơn 10 năm kinh nghiệm trong ngành, tôi cam kết mang đến lớp học 
            những kiến thức thực tiễn phong phú. Tôi đã đóng vai trò then chốt 
            trong việc thiết kế các giao diện người dùng cho những công ty công 
            nghệ hàng đầu, đảm bảo trải nghiệm người dùng mượt mà và cuốn hút. 
            Tôi luôn sẵn lòng giải đáp mọi thắc mắc của bạn.
          </p>
        </div>
        <div className="teaching-scope">
          <h3>Phạm vi bài giảng</h3>
          <ul>
            <li>Thiết kế Trải nghiệm người dùng (UX)</li>
            <li>Thiết kế Giao diện người dùng (UI)</li>
            <li>Thiết kế tương tác</li>
            <li>Thiết kế trực quan</li>
            <li>Kiểm tra khả năng sử dụng</li>
            <li>Lập khung và tạo mẫu</li>
            <li>Tư duy thiết kế</li>
          </ul>
        </div>
        <div className="professional-experience">
          <h3>Kinh nghiệm chuyên môn</h3>
          <p>
            Emily Johnson có nền tảng chuyên môn phong phú trong thiết kế UX/UI, 
            đã làm việc với những công ty nổi tiếng như [Công Ty A] và [Công Ty B]. 
            Danh mục đầu tư của cô bao gồm nhiều dự án đa dạng trải dài từ ứng dụng 
            web, ứng dụng di động đến nền tảng thương mại điện tử.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mentor_Page;
