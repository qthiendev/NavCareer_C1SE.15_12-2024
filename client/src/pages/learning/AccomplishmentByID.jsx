import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function AccomplishmentByID() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const enrollment_id = searchParams.get('enrollment_id');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccomplishment = async () => {
            console.log(enrollment_id)
            try {
                if (!enrollment_id) {
                    alert("Invalid enrollment ID.");
                    navigate('/');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/edu/get-accomplishment?enrollment_id=${enrollment_id}`);
                console.log("API Response:", response);

                if (response.data.accomplishment_certificate_id) {
                    const { accomplishment_certificate_id } = response.data;
                    navigate(`/cert/${accomplishment_certificate_id}`);
                } else if (response.data.message.includes("not found")) {
                    alert("Accomplishment not found.");
                    navigate('/');
                } else {
                    alert("Unexpected response format.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Failed to fetch accomplishment data:", error);
                alert("An error occurred. Please try again later.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchAccomplishment();
    }, [enrollment_id, navigate]);

    return loading ? <div>{enrollment_id}</div> : null;
}

export default AccomplishmentByID;
