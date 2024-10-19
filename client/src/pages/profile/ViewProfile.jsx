import React, { useState, useEffect } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewProfile.css';

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatable, setUpdatable] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                setUpdatable(response.data.aid === Number.parseInt(user_id));
            } catch (err) {
                console.error('Failed to check authentication status:', err);
            }
        };

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/profile/read?auth_id=${user_id}`, { withCredentials: true });
                if (!response.data.data) {
                    navigate('/profile/create');
                }
                setProfile(response.data.data);
                setLoading(false);
            } catch (err) {
                navigate('/profile/create');
            }
        };

        fetchProfile();
        checkAuth();
    }, [user_id, navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={profile.cover || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF33NHxM7qEJwv1ouSYlpE_5WQmKRf4Qznyw&s'}
                    alt={`${profile.user_full_name}'s cover`}
                    className="cover-picture"
                />
                <div className="profile-info">
                    <img
                        src={profile.avatar || 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-479x512-n8sg74wg.png'}
                        alt={`${profile.user_full_name}'s avatar`}
                        className="profile-picture"
                    />
                    <h2>{profile.user_full_name}</h2>
                    <p className="profile-bio">
                        <strong>Bio:</strong> {profile.bio || "This user hasn't set a bio."}
                    </p>
                </div>
            </div>
            <div className="profile-details">
                <h3>Profile Information</h3>
                <p><strong>Birthdate:</strong> {new Date(profile.birthdate).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {profile.gender ? 'Male' : 'Female'}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone Number:</strong> {profile.phone_number}</p>
                <p><strong>Address:</strong> {profile.address}</p>
                <p><strong>Date Joined:</strong> {new Date(profile.date_joined).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {profile.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            {updatable && (
                <button className="btn-edit" onClick={() => navigate(`/profile/${user_id}/update`)}>
                    Edit Profile
                </button>
            )}
        </div>
    );
}

export default ViewProfile;
