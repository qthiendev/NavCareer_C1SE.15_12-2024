import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const courses = [
  {
    id: 1,
    weeks: "4 tuần",
    level: "Căn bản",
    author: "Bởi John Smith",
    title: "Cơ bản về thiết kế web",
    description: "Tìm hiểu những nguyên tắc cơ bản của thiết kế web, bao gồm HTML, CSS và các nguyên tắc thiết kế đáp ứng. Phát triển các kỹ năng để tạo ra các trang web hấp dẫn về mặt hình ảnh và thân thiện với người dùng.",
    image: './img/main_content/courses/Course1_1.svg',
  },
  {
    id: 2,
    weeks: "6 tuần",
    level: "Trung cấp",
    author: "Bởi Emily Johnson",
    title: "Thiết kế UI/UX",
    description: "Nắm vững nghệ thuật tạo giao diện người dùng trực quan (UI) và nâng cao trải nghiệm người dùng (UX). Tìm hiểu các nguyên tắc thiết kế, wireframing, tạo mẫu và kỹ thuật kiểm tra khả năng sử dụng.",
    image: './img/main_content/courses/Course1_2.svg',
  },
  {
    id: 3,
    weeks: "8 tuần",
    level: "Trung cấp",
    author: "Bởi David Brown",
    title: "Phát triển ứng dụng di động",
    description: "Khám phá thế giới phát triển ứng dụng di động. Học cách xây dựng ứng dụng iOS và Android gốc bằng các framework hàng đầu trong ngành như Swift và Kotlin.",
    image: './img/main_content/courses/Course2_1.svg',
  },
  {
    id: 4,
    weeks: "10 tuần",
    level: "Căn bản",
    author: "Bởi Sarah Thompson",
    title: "Thiết kế đồ họa cho người mới bắt đầu",
    description: "Tìm hiểu cách phát triển ứng dụng web với React...Khám phá những kiến ​​thức cơ bản về thiết kế đồ họa, bao gồm kiểu chữ, lý thuyết màu sắc, thiết kế bố cục và kỹ thuật xử lý hình ảnh. Tạo ra những thiết kế ấn tượng về mặt hình ảnh cho phương tiện in ấn và kỹ thuật số.",
    image: './img/main_content/courses/Course2_2.svg',
  },
  {
    id: 5,
    weeks: "10 tuần",
    level: "Trung cáp",
    author: "Bởi Michael Adaams",
    title: "Phát triển Web Front-End",
    description: "Trở nên thành thạo trong phát triển web front-end. Học HTML, CSS, JavaScript và các framework phổ biến như Bootstrap và React. Xây dựng các trang web tương tác và phản hồi.",
    image: './img/main_content/courses/Course3_1.svg',
  },
  {
    id: 6,
    weeks: "6 tuần",
    level: "Nâng cao",
    author: "Bởi Jennifer Wilson",
    title: "JavaScript nâng cao",
    description: "Nâng cao kỹ năng JavaScript của bạn lên một tầm cao mới. Khám phá các khái niệm nâng cao như closures, prototypes, lập trình không đồng bộ và các tính năng ES6. Xây dựng các ứng dụng phức tạp một cách tự tin.",
    image: './img/main_content/courses/Course3_2.svg',
  }
];

const instructors = [
  {
    id: 1,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors1_1.svg',
  },
  {
    id: 2,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors1_2.svg',
  },
  {
    id: 3,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors1_3.svg',
  },
  {
    id: 4,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors1_4.svg',
  },
  {
    id: 5,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors2_1.svg',
  },
  {
    id: 6,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors2_2.svg',
  },
  {
    id: 7,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors2_3.svg',
  },
  {
    id: 8,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors2_4.svg',
  },
  {
    id: 9,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors3_1.svg',
  },
  {
    id: 10,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors3_2.svg',
  },
  {
    id: 11,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors3_3.svg',
  },
  {
    id: 12,
    name: 'John S. Sergent',
    title: 'Trưởng phòng Khoa học dữ liệu',
    imgSrc: './img/main_content/instructors/instructors3_4.svg',
  },
];

function Home() {

  //Xử lí hiệu ứng chuyển trang của course
  const [currentPage, setCurrentPage] = useState(0); // Trạng thái cho trang hiện tại

  const coursesPerPage = 2;
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Lấy các khoá học cho trang hiện tại
  const indexOfFirstCourse = currentPage * coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfFirstCourse + coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  //Xử lí hiệu ứng chuyển trang của instructor
  const [currentInstructorPage, setCurrentInstructorPage] = useState(0);
  const instructorsPerPage = 4;
  const totalInstructorPages = Math.ceil(instructors.length / instructorsPerPage); 

  const indexOfFirstInstructor = currentInstructorPage * instructorsPerPage;
  const currentInstructors = instructors.slice(
    indexOfFirstInstructor,
    indexOfFirstInstructor + instructorsPerPage
  );

  const handleInstructorPageChange = (pageNumber) => {
    setCurrentInstructorPage(pageNumber);
  };

  return (
    <div className="home-container">
      <div className="video-container">
        <video autoPlay loop muted>
          <source src="./img/main_content/background_video.mp4" type="video/mp4" />
        </video>
        <div className="content">
          <h1 style={{ color: '#77F2A1' }} className="heading">Khám phá tiềm năng, </h1>
          <h1 style={{ color: '#4F76F6' }} className="heading">xây dựng sự nghiệp</h1>
          <p className="description">
            Tạo ra một môi trường khám phá, học tập và phát triển liên tục, giúp mọi người đạt được mục tiêu nghề nghiệp của mình.
          </p>
          <a className="test-button">
            <p>THỰC HIỆN BÀI TEST</p>
            <img src="./img/main_content/arrow.svg" alt="" />
          </a>
        </div>
      </div>
      <div className="intro-container">
        <img src="./img/main_content/icon_intro1.svg" alt="" />
        <div className='intro_content'>
          <h1 style={{ color: '#043873' }} className="heading">Bạn gặp khó khăn</h1>
          <h1 style={{ color: '#4F76F6' }} className="heading">trong việc chọn nghề?</h1>
          <p className="description">
            Giới trẻ hiện nay gặp khó khăn trong việc chọn nghề do thiếu thông tin, định hướng và sự tư vấn chuyên nghiệp.
          </p>
        </div>
      </div>
      <div className="intro-container">
        <div className='intro_content'>
          <h1 style={{ color: '#043873' }} className="heading">Không biết điểm mạnh là gì?</h1>
          <h1 style={{ color: '#4F76F6' }} className="heading">Mơ hồ về tương lai?</h1>
          <p className="description">
            Thiếu thông tin, áp lực xã hội và kinh nghiệm thực tế khiến việc chọn nghề trở nên khó khăn, dẫn đến nhiều bạn trẻ cảm thấy hoang mang và mất phương hướng.
          </p>
        </div>
        <img src="./img/main_content/icon_intro2.svg" alt="" />
      </div>
      <div className="intro-container">
        <img src="./img/main_content/icon_intro3.svg" alt="" />
        <div className='intro_content'>
          <h1 style={{ color: '#043873' }} className="heading">Đã có tư vấn nghề nghiệp</h1>
          <h1 style={{ color: '#4F76F6' }} className="heading">cá nhân hóa từ NavCareer</h1>
          <p className="description">
            Chúng tôi mong muốn tạo ra một nền tảng giúp mọi người nhận được sự tư vấn chuyên nghiệp và cá nhân hóa, giúp họ tìm thấy con đường sự nghiệp phù hợp nhất.
          </p>
        </div>
      </div>
      <div className="courses-container">
        <div className="introduce">
          <div className="text-container">
            <h1 className="heading">Với các khoá học chất lượng</h1>
            <div className='text-introduce'>
              <p>
                Học từ những chuyên gia hàng đầu và nhận được sự hỗ trợ tận tình với các khóa học chất lượng của chúng tôi.
                Thành công trong tầm tay với những kiến thức và kỹ năng thực tiễn mà bạn sẽ nhận được từ các khóa học này!
              </p>
              <a href="/courses" className="courses_button">Xem tất cả</a>
            </div>
          </div>
        </div>
        <div className="courses-grid">
          {currentCourses.map(course => (
            <div className="course-card" key={course.id}>
              <img src={course.image} alt={course.title} className="course-image" />
              <div className="course-info">
                <div className="course-meta">
                  <div className="meta-item">{course.weeks}</div>
                  <div className="meta-item">{course.level}</div>
                  <div className="meta-author">{course.author}</div>
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
              </div>
              <button className="join-button">Tham gia ngay</button>
            </div>
          ))}
          
          <div className="pagination-controls">
            {Array.from({ length: totalPages }, (_, index) => (
              <div
                key={index}
                className={`pagination-dot ${currentPage === index ? 'active' : ''}`}
                onClick={() => handlePageChange(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='instructors-container'>
        <div className="introduce">
          <div className="text-container">
            <h1 className="heading">Từ những chuyên gia hàng đầu </h1>
            <div className='text-introduce'>
              <p>
                Học hỏi từ những chuyên gia hàng đầu, những người đã đạt được thành công vượt trội trong ngành của họ. Các khóa học tại NavCareer được thiết kế bởi những người có kinh nghiệm thực tiễn và kiến thức sâu rộng, giúp bạn nâng cao kỹ năng và kiến thức một cách hiệu quả nhất. Đừng bỏ lỡ cơ hội học hỏi từ những người giỏi nhất!
              </p>
              <a href="/courses" className="courses_button">Xem tất cả</a>
            </div>
          </div>
        </div>
        <div className="instructors-grid">
          {currentInstructors.map((instructor) => (
            <div key={instructor.id} className="instructor-card">
              <img src={instructor.imgSrc} alt={instructor.name} className="instructor-image" />
              <div className="instructor-info">
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-title">{instructor.title}</p>
              </div>
            </div>
          ))}

          <div className="pagination-controls">
            {Array.from({ length: totalInstructorPages }, (_, index) => (
              <div
                key={index}
                className={`pagination-dot ${currentInstructorPage === index ? 'active' : ''}`}
                onClick={() => handleInstructorPageChange(index)}
              />
            ))}
          </div>

        </div>

      </div>
      
    </div>
  );
}

export default Home;


