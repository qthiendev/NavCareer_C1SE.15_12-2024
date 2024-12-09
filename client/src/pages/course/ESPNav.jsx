import React from 'react';
import './ESPHome.css'; // Tách phần CSS nếu cần

const ESPNav = () => {
    return (
        <ul className="esp-nav">
            <li><a href="/esp">Trang chủ ESP</a></li>
            <li><a href="/">Trang chủ Hệ thống</a></li>
            <li><a href="/esp/course/view-all">Thông tin khóa học</a></li>
            <li><a href="/esp/ManageCourseReport">Báo cáo khóa học</a></li>
        </ul>
    );
};

export default ESPNav;
