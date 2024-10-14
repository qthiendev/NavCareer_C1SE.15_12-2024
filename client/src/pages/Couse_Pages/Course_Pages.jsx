// eslint-disable-next-line no-unused-vars
import React,{useState} from 'react'
import './Course_Pages.css'
import productimage from './assets/Image.png'
import MentorImage from "./assets/Ellipse 4.png"
import vector from "./assets/Vector_1.png"
import star from "./assets/start.png"
import reviewuser from "./assets/Ellipse 19.png"
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

    return (
      <div className="course-container">
        <div className="course-header">
          <h1>Thiết kế UI-UX</h1>
          <p>
              Nắm vững nghệ thuật tạo giao diện người dùng trực quan (UI) và nâng cao
              trải nghiệm người dùng (UX). Tìm hiểu các nguyên tắc thiết kế,
              wireframing, tạo mẫu và kỹ thuật kiểm tra khả năng sử dụng.
            </p>
          <p className="course-rating">
            <span className="stars">4.6 ★★★★★</span> (146,951 lượt đánh giá) 
          </p>
          <p>12 giờ học • 15 bài giảng • Phù hợp cho trình độ trung cấp</p>
         
          <div className="card">
            <img src={productimage} alt="Product" className="card-image" />
            <div className="card-content">
              <div className="pricing">
                <span className="current-price">560.000 VND</span>
                <div className="original-price-group">
                  <img
                    src="./assets/rectangle-1086.svg"
                    alt="Line"
                    className="line"
                  />
                  <span className="original-price">800.000 VND</span>
                </div>
                <span className="discount">30% Off</span>
              </div>
              <button className="buy-button">Mua ngay</button>
            </div>
          </div>
         
        </div>
  
        <div className="course-details">
          <h2>Thông tin khoá học</h2>
          <p>
          Khóa học Thiết Kế UI/UX được thiết kế nhằm trang bị cho học viên kỹ năng tạo giao diện người dùng trực quan và nâng cao trải nghiệm người dùng. Nội dung khóa học bao gồm các nguyên tắc thiết kế cơ bản, quy trình wireframing, cách tạo mẫu tương tác và kỹ thuật kiểm tra khả năng sử dụng. Khóa học phù hợp cho cả những người mới bắt đầu cũng như những người đã có kiến thức cơ bản trong lĩnh vực thiết kế và mong muốn nâng cao kỹ năng của mình.
          </p>
  
          <h2>Chứng chỉ</h2>
          <p>
          Tại NavCareer, chúng tôi thấu hiểu rằng sự công nhận chính thức là phần thưởng xứng đáng cho những nỗ lực và cống hiến không ngừng trong học tập. Hoàn thành khóa học của chúng tôi, bạn sẽ nhận được chứng chỉ danh giá, không chỉ khẳng định trình độ chuyên môn mà còn mở ra vô vàn cơ hội mới trong lĩnh vực bạn đam mê. Hãy để NavCareer đồng hành cùng bạn trên con đường chinh phục những đỉnh cao mới!
          </p>
        </div>
  
        <div className="instructor-section">
          <h2>Giáo viên</h2>
          <div className="instructor-info">
            <img src={MentorImage} alt="Instructor" className="instructor-image" />
            <div>
              <h3>Emily Johnson</h3>
              <p>Nhà thiết kế UI/UX với hơn 10 năm kinh nghiệm trong ngành...</p>
            </div>
          </div>
        </div>
  
        <div className="syllabus-section">
          <Curriculum /> {/* Replace the static syllabus with this dynamic component */}
        </div>
  
        <div className="reviews-section">
          <h2>Đánh giá của bạn học</h2>
          <Reviews />
        </div>
        
      </div>
  )
}

export default Course_Pages