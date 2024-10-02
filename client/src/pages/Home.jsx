import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
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
    </div>
  );
}

export default Home;


