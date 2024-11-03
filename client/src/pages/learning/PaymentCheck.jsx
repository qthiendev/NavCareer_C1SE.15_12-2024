import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './PaymentCheck.css';

function PaymentCheck() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [authCheck, setAuthCheck] = useState(false);

    const course_id = searchParams.get('course_id');
    const apptransid = searchParams.get('apptransid');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (!response.data.sign_in_status) {
                    navigate(`/edu/payment?course_id=${course_id}`);
                } else {
                    setAuthCheck(true);
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        if (!course_id || !authCheck) return;

        const fetchCheck = async () => {
            const intervalId = setInterval(async () => {
                try {
                    const response = await axios.post(`http://localhost:5000/edu/enroll?course_id=${course_id}&apptransid=${apptransid}`, {}, { withCredentials: true });
                    if (response.status === 200) {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                        alert('Thanh toán thành công');
                        navigate(`/edu/collection?c=${course_id}&m=0&co=0`);
                    }
                } catch (error) {
                    console.error("Retrying request...", error);
                }
            }, 1000);

            const timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                alert('Thanh toán thất bại');
                navigate(`/edu/payment?course_id=${course_id}`);
            }, 60000);

            return () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            };
        };

        fetchCheck();
    }, [authCheck, course_id, apptransid, navigate]);

    return (
        <div className="payment__loading">
            <div className="spinner"></div>
            <div className="loading-text">Đang tải, vui lòng chờ...</div>
        </div>
    );
}

export default PaymentCheck;
