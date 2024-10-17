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
                    navigate('/signin');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/signin');
            }
        };

        checkAdmin();
    }, [navigate]);

    return (
        <div className="admin-home-container">
            <h1 className="admin-home-title">Admin Dashboard</h1> {/* Optional Title */}
            <ul className="admin-nav">
                <li><a href="/admin">Trang chủ Admin</a></li>
                <li><a href="/">Trang chủ Hệ thống</a></li>
                <li><a href="/admin/user/view-all">Thông tin người dùng</a></li>
            </ul>
            <Outlet /> {/* To render nested routes if needed */}
        </div>
    );
}

export default AdminHome;
