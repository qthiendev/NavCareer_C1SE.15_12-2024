import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewProfile.css';

const CourseCard = ({ image, title, price, duration, videos, students, rating }) => (
    <div className="course-card">
      <img src={image} alt={title} className="course-image" />
      <div className="course-info">
        <div className="course-header">
          <span className="course-rating"><img src="/img/star_icon.svg" alt="start_icon" /> {rating}</span>
          <span className="course-price">{price} VND</span>
        </div>
        <h3 className="course-title">{title}</h3>
        <p className="course-details">{duration} giờ · {videos} Video · {students} Hs</p>
      </div>
    </div>
  );
  
  const CourseList = () => {
    const [page, setPage] = useState(1);
  
    const courses = [
      {
        image: '/img/student_profile/c_1.png', // Đường dẫn tới hình ảnh của bạn
        title: 'Thiết kế UI/UX',
        price: '800.000',
        duration: '12',
        videos: '15',
        students: '1900',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_2.png',
        title: 'Tiếp thị kỹ thuật số',
        price: '200.000',
        duration: '6.2',
        videos: '32',
        students: '930',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_3.png',
        title: 'Nói trước công chúng',
        price: '200.000',
        duration: '2.6',
        videos: '13',
        students: '900',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_4.png',
        title: 'Kỹ thuật mạng cơ bản',
        price: '200.000',
        duration: '4',
        videos: '17',
        students: '909',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_1.png', // Đường dẫn tới hình ảnh của bạn
        title: 'Thiết kế UI/UX',
        price: '800.000',
        duration: '12',
        videos: '15',
        students: '1900',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_2.png',
        title: 'Tiếp thị kỹ thuật số',
        price: '200.000',
        duration: '6.2',
        videos: '32',
        students: '930',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_3.png',
        title: 'Nói trước công chúng',
        price: '200.000',
        duration: '2.6',
        videos: '13',
        students: '900',
        rating: '4.9'
      },
      {
        image: '/img/student_profile/c_4.png',
        title: 'Kỹ thuật mạng cơ bản',
        price: '200.000',
        duration: '4',
        videos: '17',
        students: '909',
        rating: '4.9'
      }
    ];
  
    const coursesPerPage = 2;
    const totalPages = Math.ceil(courses.length / coursesPerPage);
  
    const handleChangePage = (newPage) => {
      setPage(newPage);
    };
  
    return (
      <div className="courses-grid">
        {courses.slice((page - 1) * coursesPerPage, page * coursesPerPage).map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
  
        <div class="pagination-wrapper">
            <div className="view-profile-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={`view-profile-page-button ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => handleChangePage(i + 1)}
                >
                    {i + 1}
                </button>
                ))}
            </div>
        </div>
      </div>
    );
};

const MentorCard = ({ image, name, title }) => (
    <div className="mentor-card">
      <img src={image} alt={name} className="mentor-image" />
      <div className="mentor-info">
        <h3 className="mentor-name">{name}</h3>
        <p className="mentor-title">{title}</p>
      </div>
    </div>
  );
  
  const MentorList = () => {
    const [page, setPage] = useState(1);
  
    const mentors = [
      { image: '/img/main_content/instructors/instructors1_1.svg', name: 'Emily Johnson', title: 'Nhà thiết kế UI/UX' },
      { image: '/img/main_content/instructors/instructors1_2.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors1_3.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors2_1.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors2_2.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors2_3.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors3_1.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors3_2.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
      { image: '/img/main_content/instructors/instructors3_3.svg', name: 'John S. Sergent', title: 'Trưởng phòng Khoa học dữ liệu' },
    ];
  
    const mentorsPerPage = 3;
    const totalPages = Math.ceil(mentors.length / mentorsPerPage);
  
    const handleChangePage = (newPage) => {
      setPage(newPage);
    };
  
    return (
      <div className="mentors-grid">
        {mentors.slice((page - 1) * mentorsPerPage, page * mentorsPerPage).map((mentor, index) => (
          <MentorCard key={index} {...mentor} />
        ))}
        <div class="pagination-wrapper">
            <div className="view-profile-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    className={`view-profile-page-button ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => handleChangePage(i + 1)}
                >
                    {i + 1}
                </button>
                ))}
            </div>
        </div>
      </div>
    );
};
  

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatable, setUpdatable] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?user_id=${user_id}`, { withCredentials: true });
                console.log(response);
                if (!response.data.user_full_name) {
                    navigate('/profile/create');
                    return;
                }
                setUpdatable(user_id === 'self' || Number.parseInt(user_id) === response.data.user_id);
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                navigate('/profile/create');
            }
        };

        fetchProfile();
    }, [user_id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }
    return (
        <div className="view-profile-container">
            
            <div className="view-left-panel">
                <div className="view-profile-header">
                    <img
                        src={profile.avatar}            
                        alt="Avatar"
                        className="view-profile-avatar"
                    />
                    <h2 className="view-profile-name">{profile.user_full_name}</h2>  
                    <p className="view-profile-bio">{profile.user_bio ? profile.user_bio : 'Have no bio.'}</p>  
                    {/* Lấy theo data người dùng đã điền khi đăng ký tài khoản */}
                    <button className="view-share-profile-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="share-icon" /> {/* Icon chia sẻ */}
                        Chia sẻ hồ sơ
                    </button>
                </div>

                <div className='view-information'>
                    <h2>THÔNG TIN</h2>
                    <div className="info-item">
                        <img src="/img/student_profile/name_icon.svg" alt="Name Icon" className="info-icon" />
                        <p>{profile.user_full_name}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/email_icon.svg" alt="Email Icon" className="info-icon" />
                        <p>{profile.user_email}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/birthday_icon.svg" alt="Birdthday Icon" className="info-icon" />
                        <p> {new Date(profile.user_birthdate).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/joinday_icon.svg" alt="Joinday Icon" className="info-icon" />
                        <p>{new Date(profile.user_created_date).toLocaleDateString()}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/gender_icon.svg" alt="Gender Icon" className="info-icon" />
                        <p>{profile.user_gender ? 'Nam' : 'Nữ'}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/address_icon.svg" alt="Address Icon" className="info-icon" />
                        <p>{profile.user_address}</p>
                    </div>
                    <div className="info-item">
                        <img src="/img/student_profile/phone_icon.svg" alt="Tel Icon" className="info-icon" />
                        <p>{profile.user_phone_number}</p>
                    </div>
                </div>

                <div className='view-information'>
                    <h2>GIỚI THIỆU</h2>
                    <p>Đây là phần giới thiệu chi tiết về cá nhân, công ty, hoặc tổ chức.</p>
                </div>

                <div className='view-information'>
                    <h2>CHỨNG CHỈ</h2>
                    <p>Danh sách các chứng chỉ, bằng cấp hoặc chứng nhận có liên quan.</p>
                </div>
            </div>

            <div className="view-right-panel">
                <div className="view-user-profile-info">
                    <div className='view-profile-courses'>
                        <h3>KHOÁ HỌC</h3>
                        <CourseList />
                    </div>
                    <div className='view-profile-instructors'>
                        <h3>GIẢNG VIÊN YÊU THÍCH</h3>
                        <MentorList />
                    </div>
                    <div className='view-systems-notify'>
                        <h3>THÔNG BÁO</h3>
                    </div>
                    {updatable && (
                        <button className="view-btn-edit" onClick={() => navigate(`/profile/update`)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;