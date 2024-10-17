import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Search.css';

const Search = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(() => {
        return sessionStorage.getItem('searchIndex') || '';
    });
    const [profiles, setProfiles] = useState(() => {
        const storedProfiles = sessionStorage.getItem('searchResults');
        return storedProfiles ? JSON.parse(storedProfiles) : [];
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');

    const handleSearch = async () => {
        if (!index) {
            setError("Index is required.");
            return;
        }

        setLoading(true);
        setError('');

        sessionStorage.removeItem('searchResults');
        sessionStorage.removeItem('searchIndex');
        setProfiles([]);

        try {
            const response = await axios.get(`http://localhost:5000/utl/search`, {
                params: { index }
            });

            sessionStorage.setItem('searchResults', JSON.stringify(response.data.data));
            sessionStorage.setItem('searchIndex', index);
            
            setProfiles(response.data.data); 
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (profile) => {
        if (profile.is_user) {
            navigate(`/profile/${profile.id}`);
        } else {
            navigate(`/course/${profile.id}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredProfiles = profiles.filter(profile => {
        if (filter === 'All') return true;
        if (filter === 'User only') return profile.is_user;
        if (filter === 'Course only') return !profile.is_user;
        return false;
    });

    return (
        <div className="search-container">
            <div className="search-input-container">
                <label htmlFor="search" className="search-label">Tìm kiếm:</label>
                <input
                    type="text"
                    id="search"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tên người dùng/khóa học"
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button" disabled={loading}>
                    {loading ? 'Searching...' : <FaSearch className="search-icon" />}
                </button>
                
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
                    <option value="All">All</option>
                    <option value="User only">User only</option>
                    <option value="Course only">Course only</option>
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            {filteredProfiles.length > 0 && (
                <div className="results-container">
                    {filteredProfiles.map(profile => (
                        <div 
                            key={profile.id} 
                            className={`profile-card ${profile.is_user ? 'student' : 'course'}`} 
                            onClick={() => handleCardClick(profile)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3>{profile.name}</h3>
                            {profile.is_user ? (
                                profile.avatar ? (
                                    <img src={profile.avatar} alt={`${profile.name}'s avatar`} className="avatar" />
                                ) : (
                                    <p>No avatar available</p>
                                )
                            ) : (
                                <img 
                                    src={profile.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz5VtX4a5G9hoIh9p-DKem9UHDiFXsBmF7xQ&s'} 
                                    alt={`${profile.name}'s avatar`} 
                                    className="avatar" 
                                />
                            )}
                            <span className="profile-type">{profile.is_user ? 'User' : 'Course'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
