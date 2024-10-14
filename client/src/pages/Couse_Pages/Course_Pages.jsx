// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import './Course_Pages.css';
import productimage from './assets/Image.png';
import MentorImage from "./assets/Ellipse 4.png";
import star from "./assets/start.png";
import reviewuser from "./assets/Ellipse 19.png";
import axios from 'axios';
const reviewData = [
  {
    name: "Mark Doe",
    date: "Đã đánh giá vào ngày 22 tháng 3 năm 2024",
    avatar: "./assets/ellipse-19.svg",
    rating: 5,
    stars: Array(5).fill({star}),
    review: `Ban đầu tôi hơi lo lắng vì không có kinh nghiệm thiết kế trước đó. 
    Nhưng các khoá học từ John Doe, đã giúp tôi tiếp cận các bài giảng 1 cách 
    dễ hiểu hơn khi chia nhỏ các khái niệm phức tạp thành các mô-đun dễ hiểu. 
    Các bài giảng video rất hấp dẫn và các ví dụ thực tế thực sự giúp củng cố 
    sự hiểu biết của tôi.`
  },
  {
    name: "Mark Doe",
    date: "Đã đánh giá vào ngày 22 tháng 3 năm 2024",
    avatar: "./assets/ellipse-19.svg",
    rating: 5,
    stars: Array(5).fill({star}),
    review: `Ban đầu tôi hơi lo lắng vì không có kinh nghiệm thiết kế trước đó. 
    Nhưng các khoá học từ John Doe, đã giúp tôi tiếp cận các bài giảng 1 cách 
    dễ hiểu hơn khi chia nhỏ các khái niệm phức tạp thành các mô-đun dễ hiểu. 
    Các bài giảng video rất hấp dẫn và các ví dụ thực tế thực sự giúp củng cố 
    sự hiểu biết của tôi.`
  },
  {
    name: "Mark Doe",
    date: "Đã đánh giá vào ngày 22 tháng 3 năm 2024",
    avatar: "./assets/ellipse-19.svg",
    rating: 5,
    stars: Array(5).fill({star}),
    review: `Ban đầu tôi hơi lo lắng vì không có kinh nghiệm thiết kế trước đó. 
    Nhưng các khoá học từ John Doe, đã giúp tôi tiếp cận các bài giảng 1 cách 
    dễ hiểu hơn khi chia nhỏ các khái niệm phức tạp thành các mô-đun dễ hiểu. 
    Các bài giảng video rất hấp dẫn và các ví dụ thực tế thực sự giúp củng cố 
    sự hiểu biết của tôi.`
  },
  // Add more reviews if needed
];

const Reviews = () => {
  return (
    <div className="reviews-container">
      <div className="ratings-summary">
        <div className="average-rating">
          <img src={star} alt="Star" className="icon" />
          <span className="rating-value">4.6</span>
          <span className="reviews-count">146,951 reviews</span>
        </div>
        <div className="ratings-breakdown">
          <div className="rating-row">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={star} alt="Star" className="icon" />
            ))}
            <span>80%</span>
          </div>
          <div className="rating-row">
            {[...Array(4)].map((_, i) => (
              <img key={i + 5} src={star} alt="Star" className="icon" />
            ))}
            <span>10%</span>
          </div>
          <div className="rating-row">
            {[...Array(3)].map((_, i) => (
              <img key={i + 5} src={star} alt="Star" className="icon" />
            ))}
            <span>5%</span>
          </div>
          <div className="rating-row">
            {[...Array(2)].map((_, i) => (
              <img key={i + 5} src={star} alt="Star" className="icon" />
            ))}
            <span>3%</span>
          </div>
          <div className="rating-row">
            {[...Array(1)].map((_, i) => (
              <img key={i + 5} src={star} alt="Star" className="icon" />
            ))}
            <span>2%</span>
          </div>
         
          {/* Additional rating rows */}
        </div>
      </div>
      <div className="reviews-list">
        {reviewData.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-header">
              <img src={reviewuser} alt="User" className="avatar" />
              <div>
                <h3 className="reviewer-name">{review.name}</h3>
                <div className="review-meta">
                  <div className="rating-stars">
                    {review.stars.map((star, i) => (
                      <img key={i} src={star} alt="Star" className="star-icon" />
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="review-text">{review.review}</p>
          </div>
        ))}
        <button className="more-reviews">Xem thêm các bài đánh giá khác</button>
      </div>
    </div>
  );
};
const Curriculum = () => {
  const sections = [
    {
      title: 'Giới thiệu về Thiết kế UI/UX',
      lectures: '3 bài giảng',
      duration: '2 giờ',
      icon: vector,
    },
    {
      title: 'Nghiên cứu và Phân tích Người dùng',
      lectures: '3 bài giảng',
      duration: '2 giờ 15 phút',
      icon: vector,
    },
    {
      title: 'Lập Khung dây và Nguyên mẫu',
      lectures: '3 bài giảng',
      duration: '2 giờ 30 phút',
      icon: vector,
    },
    {
      title: 'Thiết kế Hình ảnh và Xây dựng Thương hiệu',
      lectures: '3 bài giảng',
      duration: '2 giờ 45 phút',
      icon: vector,
    },
    {
      title: 'Kiểm tra Khả năng sử dụng và Lặp lại',
      lectures: '3 bài giảng',
      duration: '2 giờ 30 phút',
      icon: vector,
    },
  ];

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="curriculum">
      <h2 className="curriculum-title">Giáo trình</h2>
      <div className="section-list">
        {sections.map((section, index) => (
          <div key={index} className="section">
            <div className="section-header" onClick={() => toggleExpand(index)}>
              <img src={section.icon} alt="" className="icon" />
              <h3 className="section-title">{section.title}</h3>
              {expanded === index && (
                <div className="section-info">
                  <span>{section.lectures}</span>
                  <span>{section.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const Course_Pages = () => {
  const [courseData, setCourseData] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course/read?course_id=123'); // Replace 123 with actual course_id
        if (response.status === 200) {
          setCourseData(response.data);
          setReviews(response.data.reviews || []); // Set reviews if available in the response
        } else if (response.status === 203) {
          setError('Failed to retrieve course data.');
        }
      } catch (err) {
        setError('Error fetching course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="course-container">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p>{courseData.description}</p>
        <p className="course-rating">
          <span className="stars">{courseData.rating} ★★★★★</span> ({courseData.reviewCount} lượt đánh giá)
        </p>
        <p>{courseData.duration} • {courseData.lectures} • Phù hợp cho trình độ trung cấp</p>

        <div className="card">
          <img src={productimage} alt="Product" className="card-image" />
          <div className="card-content">
            <div className="pricing">
              <span className="current-price">{courseData.currentPrice} VND</span>
              <div className="original-price-group">
                <img src="./assets/rectangle-1086.svg" alt="Line" className="line" />
                <span className="original-price">{courseData.originalPrice} VND</span>
              </div>
              <span className="discount">{courseData.discount}% Off</span>
            </div>
            <button className="buy-button">Mua ngay</button>
          </div>
        </div>
      </div>

      <div className="course-details">
        <h2>Thông tin khoá học</h2>
        <p>{courseData.info}</p>

        <h2>Chứng chỉ</h2>
        <p>{courseData.certificateInfo}</p>
      </div>

      <div className="instructor-section">
        <h2>Giáo viên</h2>
        <div className="instructor-info">
          <img src={MentorImage} alt="Instructor" className="instructor-image" />
          <div>
            <h3>{courseData.instructor.name}</h3>
            <p>{courseData.instructor.bio}</p>
          </div>
        </div>
      </div>

      <div className="syllabus-section">
        <Curriculum />
      </div>

      <div className="reviews-section">
        <h2>Đánh giá của bạn học</h2>
        <Reviews reviews={reviews} />
      </div>
    </div>
  );
};

export default Course_Pages