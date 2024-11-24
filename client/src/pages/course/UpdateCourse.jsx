import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateCourse.css';

function UpdateCourse() {
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState({});
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const [isBanned, setIsBanned] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkBanStatus = async () => {
            try {
                await axios.get('http://localhost:5000/admin/user/ban/check?procedure_name=UpdateCourse', { withCredentials: true });
                setIsBanned(true);
            } catch (error) {
                console.error('Failed to check ban status:', error);
                alert('BANNED');
                navigate(-1);
            }
        };

        checkBanStatus();
    }, [navigate]);

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!isBanned) return;
            try {
                const response = await axios.get('http://localhost:5000/authz/esp', { withCredentials: true });
                if (response.status === 200) {
                    setIsAuthorized(true);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Authorization check failed:', error);
                navigate('/');
            }
        };

        checkAuthorization();
    }, [isBanned, navigate]);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!isBanned || !isAuthorized) return;
            try {
                const response = await axios.get(`http://localhost:5000/course/read-full?course_id=${course_id}`, { withCredentials: true });
                const data = response.data;
                setCourseData({
                    course_id: data.course_id,
                    authentication_id: data.authentication_id,
                    course_name: data.course_name,
                    course_short_description: data.course_short_description,
                    course_full_description: data.course_full_description,
                    course_price: data.course_price >= 1000 || data.course_price === 0 ? data.course_price : 1000,
                    course_duration: data.course_duration,
                    course_status: Boolean(data.course_status),
                    user_id: data.user_id,
                    user_full_name: data.user_full_name,
                });
                const filteredModules = (data.modules || []).map(module => ({
                    module_id: module.module_id,
                    module_name: module.module_name,
                    module_ordinal: module.module_ordinal
                }));
                setModules(filteredModules);
            } catch (error) {
                alert("Cannot find course");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [course_id, isBanned, isAuthorized, navigate]);

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        if (!courseData.course_name || !courseData.course_short_description || !courseData.course_full_description) {
            setErrorMessage('Course name and description cannot be empty.');
            return;
        }
        if (courseData.course_price !== 0 && courseData.course_price < 1000) {
            setErrorMessage('Course price must be 0 or at least 1000.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/course/update`, {
                course_id: Number(course_id),
                ...courseData
            }, { withCredentials: true });
            alert('Course updated successfully');
            navigate(0);
        } catch (error) {
            setErrorMessage('Failed to update course. Please try again later.');
            console.error('Failed to update course:', error);
        }
    };

    const handleDeleteModule = async (course_id, module_id) => {
        try {
            await axios.post(`http://localhost:5000/course/module/delete?course_id=${course_id}&module_id=${module_id}`, {},
                { withCredentials: true });
            alert('Module deleted successfully');
            navigate(0);
        } catch (error) {
            console.error('Failed to delete module:', error);
            alert('Failed to delete module');
        }
    };

    const handleAddModule = async (course_id) => {
        try {
            await axios.post(`http://localhost:5000/course/module/create?course_id=${course_id}&module_name=Module mới`, {},
                { withCredentials: true });
            alert('Module added successfully');
            navigate(0);
        } catch (error) {
            console.error('Failed to delete module:', error);
            alert('Failed to add module');
        }
    };

    const handleOrdinalChange = async (index, newOrdinal) => {
        const currentModule = modules[index];
        const targetIndex = modules.findIndex(module => module.module_ordinal === newOrdinal);

        if (targetIndex === -1 || currentModule.module_ordinal === newOrdinal) return;

        const targetModule = modules[targetIndex];

        try {
            await axios.post(`http://localhost:5000/course/module/ordinal`, null, {
                params: {
                    course_id,
                    module_id_1: currentModule.module_id,
                    module_id_2: targetModule.module_id
                },
                withCredentials: true
            });

            const newModules = [...modules];

            // Swap the ordinals in local state
            [newModules[index].module_ordinal, newModules[targetIndex].module_ordinal] =
                [newModules[targetIndex].module_ordinal, newModules[index].module_ordinal];

            setModules(newModules);

            alert('Module ordinals swapped successfully');
        } catch (error) {
            console.error('Failed to swap module ordinals:', error);
            alert('Failed to swap module ordinals');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-course-container">
            <h2>Update Course</h2>
            <form onSubmit={handleUpdateCourse}>
                <label>
                    Course Name:
                    <input
                        type="text"
                        value={courseData.course_name}
                        onChange={(e) => setCourseData({ ...courseData, course_name: e.target.value })}
                    />
                </label>
                <label>
                    Short Description:
                    <textarea
                        className="short-description"
                        maxLength="1000"
                        value={courseData.course_short_description}
                        onChange={(e) => setCourseData({ ...courseData, course_short_description: e.target.value })}
                    />
                </label>
                <label>
                    Full Description:
                    <textarea
                        className="full-description"
                        maxLength="5000"
                        value={courseData.course_full_description}
                        onChange={(e) => setCourseData({ ...courseData, course_full_description: e.target.value })}
                    />
                </label>
                <label>
                    Course Price:
                    <input
                        type="number"
                        min="0"
                        value={courseData.course_price}
                        onChange={(e) => {
                            const price = parseInt(e.target.value) || 0;
                            setCourseData({ ...courseData, course_price: price === 0 || price >= 1000 ? price : 1000 });
                        }}
                    />
                </label>
                <label>
                    Course Duration:
                    <input
                        type="text"
                        value={courseData.course_duration}
                        onChange={(e) => setCourseData({ ...courseData, course_duration: e.target.value })}
                    />
                </label>
                <label>
                    Course Status:
                    <select
                        value={courseData.course_status}
                        onChange={(e) => setCourseData({ ...courseData, course_status: e.target.value === 'true' })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </label>
                <button type="submit">Update Course</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <h3>Modules</h3>
            <ul>
                {modules.map((module, index) => (
                    <li key={module.module_id}>
                        <div className="module-item">
                            <select
                                value={module.module_ordinal}
                                onChange={(e) => handleOrdinalChange(index, parseInt(e.target.value))}
                            >
                                {modules.map((m, i) => (
                                    <option key={i} value={m.module_ordinal}>{m.module_ordinal}</option>
                                ))}
                            </select>
                            <span className="module-name">{module.module_name}</span>
                            <button onClick={() => navigate(`/esp/course/0/module/${module.module_id}/update`)}>Modify</button>
                            <button onClick={() => handleDeleteModule(courseData.course_id, module.module_id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <button onClick={() => handleAddModule(courseData.course_id)}>Add New Module</button>
        </div>
    );
}

export default UpdateCourse;
