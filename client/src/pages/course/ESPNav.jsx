import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ESPHome.css'; // Tách phần CSS nếu cần

const ESPNav = () => {
    const navigate = useNavigate();
    return (
        <ul className="esp-nav">
            <li><a onClick={() => { navigate('/esp') }}>Trang chủ ESP</a></li>
            <li><a onClick={() => { navigate('/') }}>Trang chủ Hệ thống</a></li>
            <li><a onClick={() => { navigate('/esp/course/view-all') }}>Thông tin khóa học</a></li>
            <li><a onClick={() => { navigate('/esp/ManageCourseReport') }}>Báo cáo khóa học</a></li>
        </ul>
    );
};

export default ESPNav;
