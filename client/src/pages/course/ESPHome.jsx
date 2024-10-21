import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import './ESPHome.css';

function ESPHome() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkESP = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200)
                    navigate('/');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };

        checkESP();
    }, [navigate]);

    return (
        <div className="esp-home-container">
            <h1 className="esp-home-title">ESP Dashboard</h1> {/* Optional Title */}
            <ul className="esp-nav">
                <li><a href="/esp">Trang chủ ESP</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/esp/course/view-all">Thông tin khóa học</a></li>
            </ul>
            <Outlet /> {/* To render nested routes if needed */}
        </div>
    );
}

export default ESPHome;
