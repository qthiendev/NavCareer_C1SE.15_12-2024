import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateCourse.css';

function CreateCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState('');
    const [courseShortDescription, setCourseShortDescription] = useState('');
    const [courseFullDescription, setCourseFullDescription] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [error, setError] = useState(null);

    const [banChecked, setBanChecked] = useState(false);
    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=CreateCourse', { withCredentials: true });
                console.log(response);
                setBanChecked(true);
            } catch (error) {
                console.error('Failed to check ban status:', error);
                alert('BANNED');
                navigate(-1);
            }
        };

        checkBanStatus();
    }, []);

    const [espChecked, setESPChecked] = useState(false);
    useEffect(() => {
        const checkAuthorization = async () => {
            if (!banChecked) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status !== 200) {
                    navigate('/'); // Redirect if not authorized
                }
                setESPChecked(true);
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            } finally {
                setLoading(false); // Set loading to false after the check
            }
        };

        checkAuthorization();
    }, [banChecked]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            course_name: courseName,
            course_short_description: courseShortDescription,
            course_full_description: courseFullDescription,
            course_duration: courseDuration,
            course_price: coursePrice,
        };

        try {
            const response = await axios.post('http://localhost:5000/course/create', formData, { withCredentials: true });
            if (response.status === 201 || response.status === 200) {
                navigate('/esp/course/view-all');
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
        <div className="create-course">
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
                    <label htmlFor="courseShortDescription">Course Short Description:</label>
                    <input
                        type="text"
                        id="courseShortDescription"
                        value={courseShortDescription}
                        onChange={(e) => setCourseShortDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseFullDescription">Course Full Description:</label>
                    <textarea
                        id="courseFullDescription"
                        value={courseFullDescription}
                        onChange={(e) => setCourseFullDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseDuration">Duration:</label>
                    <input
                        type="text"
                        id="courseDuration"
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(e.target.value)}
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
