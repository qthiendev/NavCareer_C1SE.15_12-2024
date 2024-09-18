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
    const authID = localStorage.getItem('AUTHENTICATION_ID');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/get?USER_ID=${encodeURIComponent(user_id)}`);

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setIsEdit(data.AUTHENTICATION_ID === authID);
                    document.title = `Profile: ${data.USER_NAME} | NavCareer`;
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
    }, [user_id, navigate, authID]);

    if (isLoading) return <p>Loading profile...</p>;

    if (error) return <p className="error-message">{error}</p>;

    if (!profile) return <p>No profile data available.</p>;

    // Map gender value to text
    const genderText = profile.GENDER === true ? 'Male' : 'Female';

    return (
        <div className="profile-container">
            <h1>{profile.DISPLAY_LAST_NAME} {profile.DISPLAY_FIRST_NAME}</h1>
            <div className="profile-details">
                <p><strong>Username:</strong> {profile.USER_NAME}</p>
                <p><strong>Gender:</strong> {genderText}</p>
                <p><strong>Birth Date:</strong> {profile.BIRTH_DATE}</p>
                <p><strong>Phone Number:</strong> {profile.PHONE_NUMBER}</p>
                <p><strong>Address:</strong> {profile.ADDRESS}</p>
            </div>

            {isEdit && (
                <button className="edit-profile-button" onClick={() => navigate(`/profile/edit/${user_id}`)}>
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default Profile;
