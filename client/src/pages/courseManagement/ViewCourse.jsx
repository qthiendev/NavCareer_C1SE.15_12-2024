// eslint-disable-next-line no-unused-vars
import React from 'react';
import './ViewCourse.css';

// Sample course data

const ViewCourse = () => {
  const courses = [
    {
      image: './assets/course_1.png',
      title: 'Cơ sở dữ liệu Web',
      description: 'Thiết kế và quản lý cơ sở dữ liệu cho ứng dụng web.',
      hours: '4,5 giờ',
      videos: '24 Video',
      students: '1.900 Hs',
      rating: '4.8',
      price: '200.000 VND',
    },
    {
      image: './assets/course_2.png',
      title: 'Tiếp thị kỹ thuật số',
      description: 'Chiến lược tiếp thị qua internet, gồm SEO và mạng xã hội.',
      hours: '6,2 giờ',
      videos: '32 Video',
      students: '930 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_3.png',
      title: 'Khoa học dữ liệu cơ bản',
      description: 'Phân tích dữ liệu và sử dụng Python để giải quyết bài toán thực tiễn.',
      hours: '8 giờ',
      videos: '46 Video',
      students: '1.043 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_4.png',
      title: 'Nói trước công chúng',
      description: 'Kỹ năng thuyết trình và giao tiếp tự tin.',
      hours: '2,6 giờ',
      videos: '13 Video',
      students: '900 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_5.png',
      title: 'Kỹ thuật mạng cơ bản',
      description: 'Nguyên lý và quản lý mạng máy tính.',
      hours: '4 giờ',
      videos: '17 Video',
      students: '909 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_6.png',
      title: 'UI/UX cơ bản',
      description: 'Thiết kế giao diện và trải nghiệm người dùng hiệu quả.',
      hours: '5 giờ',
      videos: '25 Video',
      students: '1.150 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_7.png',
      title: 'Tiếng Anh cơ bản',
      description: 'Cải thiện kỹ năng ngôn ngữ cơ bản.',
      hours: '12 giờ',
      videos: '50 Video',
      students: '1.430 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_8.png',
      title: 'Công nghệ kết hợp thực vật',
      description: 'Ứng dụng công nghệ trong nông nghiệp bền vững.',
      hours: '7 giờ',
      videos: '24 Video',
      students: '505 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
    {
      image: './assets/course_9.png',
      title: 'Học máy',
      description: 'Mô hình và thuật toán học máy để dự đoán dữ liệu.',
      hours: '7 giờ',
      videos: '17 Video',
      students: '200 Hs',
      rating: '4.9',
      price: '200.000 VND',
    },
  ];
  const CourseCard = (data) => {
    const { image, title, description, hours, videos, students, rating, price } = data
    return (
      <div className="course-card">
        <img src={image} alt={title} className="course-image" />
        <div className="course-content">
          <div className="course-rating-price">
          <div className="rating">
            <span>{rating}</span>
            <img src="./assets/start.png" alt="star" className="star-icon" />
          </div>
            <span className="price">{price}</span>
          </div>
          <h3 className="course-title">{title}</h3>
          <p className="course-description">{description}</p>
          <div className="course-info">
            <span>{hours}</span>
            <span>{videos}</span>
            <span>{students}</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Pagination component
  const Pagination = () => {
    return (
      <div className="pagination">
        <div className="page active">1</div>
        <div className="page">2</div>
        <div className="page">3</div>
        <div className="ellipsis">...</div>
        <div className="page">8</div>
      </div>
    );
  };
  
  return (
    
    <div className="course-page">
   
      <nav className="breadcrumb">Trang chủ &gt; Khoá học</nav>
      <div className="filter-row">
        <div className="filter-item">
          <img src='./assets/Vector_1.png' alt="" className="filter-icon" />
          <span className="filter-text">Đánh giá từ người dùng</span>
        </div>
        <div className="filter-item">
          <img src='./assets/Vector_2.png' alt="" className="filter-icon" />
          <span className="filter-text">Số giờ học</span>
        </div>
        <div className="filter-item">
          <img src='./assets/Vector_1.png' alt="" className="filter-icon" />
          <span className="filter-text">Số lượng học sinh tham gia</span>
        </div>
        <div className="filter-item">
          <img src='./assets/Vector_1.png' alt="" className="filter-icon" />
          <span className="filter-text">Mức giá của khoá học</span>
        </div>
        <div className="filter-button">
          <span className="filter-button-text">Lọc</span>
          <img src='./assets/Vector_5.png' alt="" className="filter-button-icon" />
        </div>
      </div>
      <div className="filter-bar">
        {['Tất cả', 'Thiết kế', 'Lập trình', 'Tiếp thị', 'Kỹ năng mềm', 'Mạng', 'Phân tích dữ liệu'].map((category, index) => (
          <button key={index}>{category}</button>
        ))}
      </div>

      <div className="course-list">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>

      {/* Add Pagination here */}
      <Pagination />

     
    </div>
  );
};

export default ViewCourse;
