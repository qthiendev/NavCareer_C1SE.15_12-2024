import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminHome.css';

function AdminHome() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/adm', { withCredentials: true });
                if (response.status !== 200)
                    navigate('/');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };

        checkAdmin();
    }, [navigate]);

    return (
        <div className="admin-home-container">
            <ul className="admin-nav">
                <li><a href="/admin">Trang chủ Admin</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/admin/user/view-all">Thông tin Người dùng</a></li>
                <li><a href="/admin/user/view-all">Phân quyền Chung</a></li>
                <li><a href="/admin/user/view-all">Phân quyền ESP</a></li>
                <li><a href="/admin/user/view-all">Phân quyền Student</a></li>
                <li><a href="/admin/course/view-all">Thông tin Khóa học</a></li>
            </ul>
            <h1 className="admin-home-title">Admin Dashboard</h1> {/* Optional Title */}
        </div>
    );
}

export default AdminHome;
