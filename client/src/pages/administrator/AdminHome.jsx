import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
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
        <div class="admin-home-container">
            <ul class="admin-nav">
                <li><a href="/admin/user/view-all">Trang chủ Admin</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/admin/user/view-all">Thông tin người dùng</a></li>
            </ul>
        </div>
    );
}

export default AdminHome;