import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateProfile.css';

function CreateProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [aid, setAid] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfileStatus = async () => {
            try {
                const authResponse = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (!authResponse.data.sign_in_status) {
                    navigate('/signin');
                    return;
                }

                const { aid } = authResponse.data;

                setAid(aid);

                const profileResponse = await axios.get(`http://localhost:5000/profile/read?auth_id=${aid}`, { withCredentials: true });
                console.log(profileResponse);
                if (!Number.isNaN(profileResponse.data.data.user_id)) {
                    navigate(`/profile/${aid}`);
                } else {
                    setUserData({ aid });
                }

            } catch (error) {
                console.error('Failed to check profile status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkProfileStatus();
    }, [navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formattedBirthdate = `${day}/${month}/${year}`; // Format birthdate as dd/mm/yyyy

        const formData = {
            userFullName: e.target.userFullName.value,
            email: e.target.email.value,
            birthdate: formattedBirthdate,
            gender: e.target.gender.value,
            phoneNumber: e.target.phoneNumber.value,
            address: e.target.address.value,
        };

        try {
            await axios.post('http://localhost:5000/profile/create', formData, { withCredentials: true });
            navigate(`/profile/${aid}`);
        } catch (error) {
            console.error('Failed to create profile:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    // Generate day, month, and year options
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div className="create-profile-container">
            <h2>Create Profile</h2>

            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Full Name</label>
                    <input type="text" name="userFullName" required />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" name="email" required />
                </div>

                <div>
                    <label>Birthdate</label>
                    <div className="birthdate-select">
                        <select name="day" value={day} onChange={(e) => setDay(e.target.value)} required>
                            <option value="">Day</option>
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        <select name="month" value={month} onChange={(e) => setMonth(e.target.value)} required>
                            <option value="">Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <select name="year" value={year} onChange={(e) => setYear(e.target.value)} required>
                            <option value="">Year</option>
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label>Gender</label>
                    <select name="gender" required>
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                    </select>
                </div>

                <div>
                    <label>Phone Number</label>
                    <input type="tel" name="phoneNumber" required />
                </div>

                <div>
                    <label>Address</label>
                    <input type="text" name="address" required />
                </div>

                <button type="submit">Create Profile</button>
            </form>
        </div>
    );
}

export default CreateProfile;
