import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import ESPNav from './ESPNav';
import './ESPHome.css';

function ESPHome() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkESP = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200) navigate('/');
            } catch (err) {
                console.error('Failed to check authentication status:', err);
                navigate('/');
            }
        };

        checkESP();
    }, [navigate]);

    return (
        <div className="esp-home-container">
            <h1 className="esp-home-title">ESP Dashboard</h1>
            <ESPNav /> {/* Sử dụng ESPNav */}
            <Outlet /> {/* To render nested routes */}
        </div>
    );
}

export default ESPHome;
