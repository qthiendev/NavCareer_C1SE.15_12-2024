import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const navigate = useNavigate();
    const { user_id } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/get?USER_ID=${encodeURIComponent(user_id)}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setIsEdit(data.AUTHENTICATION_ID == localStorage.getItem('AUTHENTICATION_ID'));
                } else {
                    navigate('/');
                }

            } catch (err) {
                setError('An error occurred while fetching profile data.');
                console.error('Error fetching profile data:', err);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user_id, navigate]);

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="profile-container">
            {profile ? (
                <div className="profile-info">
                    <h1>{profile.DISPLAY_FIRST_NAME} {profile.DISPLAY_LAST_NAME}</h1>
                    <p><strong>Username:</strong> {profile.USER_NAME}</p>
                    <p><strong>Gender:</strong> {profile.GENDER}</p>
                    <p><strong>Birth Date:</strong> {profile.BIRTH_DATE}</p>
                    <p><strong>Phone Number:</strong> {profile.PHONE_NUMBER}</p>
                    <p><strong>Address:</strong> {profile.ADDRESS}</p>

                    {/* Conditionally render the 'Edit Profile' button */}
                    {isEdit && (
                        <button className="edit-profile-button" onClick={() => navigate(`/profile/edit/${user_id}`)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
        </div>
    );
};

export default Profile;