import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import './Search.css';

const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [index, setIndex] = useState(() => {
        return sessionStorage.getItem('searchIndex') || new URLSearchParams(location.search).get('index') || '';
    });
    const [profiles, setProfiles] = useState(() => {
        const storedProfiles = sessionStorage.getItem('searchResults');
        return storedProfiles ? JSON.parse(storedProfiles) : [];
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Perform search if 'index' is present in the URL
        const queryIndex = new URLSearchParams(location.search).get('index');
        if (queryIndex) {
            setIndex(queryIndex);
            handleSearch(queryIndex);
        }
    }, [location.search]);

    const handleSearch = async (searchIndex = index) => {
        if (!searchIndex) {
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
                params: { index: searchIndex }
            });

            sessionStorage.setItem('searchResults', JSON.stringify(response.data.data));
            sessionStorage.setItem('searchIndex', searchIndex);
            
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
            navigate(`/search?index=${index}`);
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
            <div className="filter-container">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
                    <option value="All">All</option>
                    <option value="User only">User only</option>
                    <option value="Course only">Course only</option>
                </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                filteredProfiles.length > 0 && (
                    <div className="results-container">
                        {filteredProfiles.map(profile => (
                            <div 
                                key={profile.id} 
                                className={`profile-card ${profile.is_user ? 'student' : 'course'}`} 
                                onClick={() => handleCardClick(profile)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="avatar-container">
                                    <img 
                                        src={profile.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz5VtX4a5G9hoIh9p-DKem9UHDiFXsBmF7xQ&s'} 
                                        alt={`${profile.name}'s avatar`} 
                                        className="avatar" 
                                    />
                                </div>
                                <h3 className="profile-name">{profile.name}</h3>
                                <p className="profile-description">{profile.description}</p>
                                <span className="profile-type">{profile.is_user ? 'User' : 'Course'}</span>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Search;
