import React, { useEffect, useState } from 'react';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch profile data when the component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Assuming AUTHENTICATION_ID is stored in localStorage
                const AUTHENTICATION_ID = localStorage.getItem('AUTHENTICATION_ID');

                // Fetch profile data
                const response = await fetch(`http://localhost:5000/profile/get?AUTHENTICATION_ID=${encodeURIComponent(AUTHENTICATION_ID)}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    setError('Failed to fetch profile data.');
                }
            } catch (err) {
                setError('An error occurred while fetching profile data.');
                console.error('Error fetching profile data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []); // Empty dependency array means this runs once on component mount

    // Display loading state or error message
    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // Display profile information
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
                </div>
            ) : (
                <p>No profile data available.</p>
            )}
        </div>
    );
};

export default Profile;
