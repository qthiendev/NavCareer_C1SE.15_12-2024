import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCourse.css';

function CreateCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/'); // Redirect if not authorized
                }
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            } finally {
                setLoading(false); // Set loading to false after the check
            }
        };

        checkAuthorization();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            course_name: courseName,
            course_description: courseDescription,
            duration: duration,
            course_price: coursePrice,
        };

        try {
            const response = await axios.post('http://localhost:5000/course/create', formData, { withCredentials: true });
            if (response.status === 201) {
                navigate('/'); // Redirect upon successful course creation
            }
        } catch (error) {
            console.error('Course creation failed:', error);
            setError('Failed to create course. Please try again.'); // Set error message
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    return (
        <div>
            <h1>Create Course</h1>
            {error && <p className="error">{error}</p>} {/* Display error message if exists */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="courseName">Course Name:</label>
                    <input
                        type="text"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseDescription">Course Description:</label>
                    <textarea
                        id="courseDescription"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="duration">Duration:</label>
                    <input
                        type="text"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="coursePrice">Course Price:</label>
                    <input
                        type="number"
                        id="coursePrice"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Course</button>
            </form>
        </div>
    );
}

export default CreateCourse;
