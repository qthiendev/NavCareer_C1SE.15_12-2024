import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './UpdateCourse.css';

function UpdateCourse() {
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState(null);
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
            } finally {
                setLoading(false);
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
                setCourseData(data);
                setModules(data.modules || []);
            } catch (error) {
                alert("Cannot find course");
                navigate(-1);
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

        try {
            await axios.post(`http://localhost:5000/course/update`, {
                course_id: Number(course_id),
                ...courseData,
                modules,
            }, { withCredentials: true });
            alert('Course updated successfully');
            navigate(-1);
        } catch (error) {
            setErrorMessage('Failed to update course. Please try again later.');
            console.error('Failed to update course:', error);
        }
    };

    const addModule = () => {
        setModules(prevModules => [
            ...prevModules,
            { module_ordinal: prevModules.length, module_name: '', collections: [] },
        ]);
    };

    const handleModuleChange = (index, value) => {
        setModules(prevModules => {
            const updatedModules = [...prevModules];
            updatedModules[index].module_name = value;
            return updatedModules;
        });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedModules = Array.from(modules);
        const [removed] = reorderedModules.splice(result.source.index, 1);
        reorderedModules.splice(result.destination.index, 0, removed);

        const updatedModules = reorderedModules.map((module, index) => ({
            ...module,
            module_ordinal: index,
        }));

        setModules(updatedModules);
    };

    const deleteModule = async (index) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;

        const updatedModules = modules.filter((_, i) => i !== index);
        setModules(updatedModules);
        try {
            await axios.delete(`http://localhost:5000/course/${course_id}/module/${modules[index].module_ordinal}`, { withCredentials: true });
            alert('Module deleted successfully');
        } catch (error) {
            setErrorMessage('Failed to delete module. Please try again later.');
            console.error('Failed to delete module:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-course-main-container">
            <div className="update-course-sidebar">
                <div className="update-course-profile-header">
                    <img src="/path/to/avatar" alt="Avatar" className="update-course-profile-avatar" />
                    <h2 className="update-course-profile-name">User Full Name</h2>
                    <p className="update-course-profile-bio">User Bio Here</p>
                    <button className="update-course-profile-share-btn">
                        <img src="/img/student_profile/share_icon.svg" alt="Share" className="update-course-share-icon" />
                        Chia sẻ hồ sơ
                    </button>
                </div>
                <div className="update-course-profile-menu">
                    <ul>
                        <li className="update-course-menu-item active">Hồ sơ người dùng</li>
                        <li className="update-course-menu-item">Các khoá học</li>
                        <li className="update-course-menu-item">Giảng viên yêu thích</li>
                        <li className="update-course-menu-item">Tin nhắn</li>
                        <li style={{ border: 'none' }} className="update-course-menu-item">Liên hệ admin</li>
                    </ul>
                </div>
            </div>

            <div className="update-course-content">
                <div className="update-course-form-container">
                    <form onSubmit={handleUpdateCourse}>
                        <div className="update-course-form-section">
                            <div className="update-course-form-row">
                                <div className="update-course-form-group">
                                    <label htmlFor="course_name">Tên Khóa Học:</label>
                                    <input
                                        type="text"
                                        id="course_name"
                                        value={courseData?.course_name || ''}
                                        onChange={(e) => setCourseData({ ...courseData, course_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="update-course-form-group">
                                    <label htmlFor="course_price">Giá:</label>
                                    <input
                                        type="number"
                                        id="course_price"
                                        value={courseData?.course_price || ''}
                                        onChange={(e) => setCourseData({ ...courseData, course_price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="update-course-form-row">
                                <div className="update-course-form-group">
                                    <label htmlFor="course_short_description">Mô Tả Khóa Học:</label>
                                    <textarea
                                        id="course_short_description"
                                        value={courseData?.course_short_description || ''}
                                        onChange={(e) => setCourseData({ ...courseData, course_short_description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="update-course-form-row">
                                <div className="update-course-form-group">
                                    <label htmlFor="course_full_description">Thông Tin Khóa Học:</label>
                                    <textarea
                                        id="course_full_description"
                                        value={courseData?.course_full_description || ''}
                                        onChange={(e) => setCourseData({ ...courseData, course_full_description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="update-course-form-row">
                                <div className="update-course-form-group">
                                    <label htmlFor="course_status">Trạng Thái:</label>
                                    <select
                                        id="course_status"
                                        value={String(courseData?.course_status)}
                                        onChange={(e) => setCourseData({ ...courseData, course_status: e.target.value === 'true' })}>
                                        <option value="true">Active</option>
                                        <option value="false">Locked</option>
                                    </select>
                                </div>
                            </div>
                            <div className="update-course-form-row">
                                <h3>Khóa Học</h3>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {modules.map((module, index) => (
                                                <Draggable key={module.module_ordinal} draggableId={String(module.module_ordinal)} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="update-course-module-item">
                                                            <input
                                                                type="text"
                                                                value={module.module_name}
                                                                onChange={(e) => handleModuleChange(index, e.target.value)}
                                                                placeholder="Module Name"
                                                            />
                                                            <button type="button" onClick={() => deleteModule(index)} className="delete-module-btn">Delete</button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                            <button type="button" onClick={addModule} className="add-module-btn">Add Module</button>
                            <button type="submit" className="update-course-submit-btn">Update Course</button>
                        </div>
                    </form>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}

export default UpdateCourse;
