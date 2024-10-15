import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

function UpdateProfile() {
    const [profile, setProfile] = useState({
        user_id: null,
        user_full_name: '',
        email: '',
        phone_number: '',
        address: '',
        gender: '',
        date_joined: '',
        is_active: false,
    });

    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                if (!response.data.sign_in_status || response.data.aid !== Number.parseInt(user_id)) {
                    navigate('/');
                }
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?user_id=${user_id}`, { withCredentials: true });
                const birthdate = new Date(response.data.data.birthdate);
                setProfile({
                    user_id: response.data.data.authentication_id,
                    user_full_name: response.data.data.user_full_name,
                    email: response.data.data.email,
                    phone_number: response.data.data.phone_number,
                    address: response.data.data.address,
                    gender: response.data.data.gender,
                    date_joined: response.data.data.date_joined,
                    is_active: response.data.data.is_active,
                });

                // Set the initial day, month, and year
                setDay(birthdate.getDate());
                setMonth(birthdate.getMonth() + 1); // Month is 0-based
                setYear(birthdate.getFullYear());

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile data.');
                setLoading(false);
            }
        };

        checkAuth();
        fetchProfileData();
    }, [user_id]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format birthdate as day/month/year
        const formattedBirthdate = `${day}/${month}/${year}`;

        try {
            await axios.put(`http://localhost:5000/profile/update`, 
            {
                ...profile,
                birthdate: formattedBirthdate
            },
            { withCredentials: true });

            alert('Profile updated successfully!');
            navigate(`/profile/${profile.user_id}`);
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    if (loading) return <div>Loading...</div>;

    // Generate arrays for dropdowns
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: (new Date().getFullYear() - 1900 + 1) }, (_, i) => 1900 + i);

    return (
        <div className="update-profile-container">
            <h1>Update Profile</h1>
            {error && <div className="error">{error}</div>}
            <form className="update-profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user_full_name">Full Name:</label>
                    <input
                        type="text"
                        id="user_full_name"
                        name="user_full_name"
                        value={profile.user_full_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="birthdate">Birthdate:</label>
                    <div className="birthdate-fields">
                        <select
                            id="day"
                            name="day"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                        >
                            <option value="">Day</option>
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select
                            id="month"
                            name="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        >
                            <option value="">Month</option>
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <select
                            id="year"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        >
                            <option value="">Year</option>
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={profile.gender ? "true" : "false"}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone_number">Phone Number:</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={profile.phone_number}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleInputChange}
                    />
                </div>

                <button type="submit" className="btn-update">Update Profile</button>
            </form>
        </div>
    );
}

export default UpdateProfile;
