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
        <div className="update-course">
            <h2>
                Update Course: <a href={`/course/${course_id}`}>{courseData?.course_name}</a>
            </h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleUpdateCourse}>
                <div>
                    <label>Course Name</label>
                    <input
                        type="text"
                        value={courseData?.course_name || ''}
                        onChange={(e) => setCourseData({ ...courseData, course_name: e.target.value })}
                    />
                </div>
                <div>
                    <label>Course Price</label>
                    <input
                        type="number"
                        value={courseData?.course_price || ''}
                        onChange={(e) => setCourseData({ ...courseData, course_price: e.target.value })}
                    />
                </div>
                <div>
                    <label>Course Short Description</label>
                    <textarea
                        value={courseData?.course_short_description || ''}
                        onChange={(e) => setCourseData({ ...courseData, course_short_description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Course Full Description</label>
                    <textarea
                        value={courseData?.course_full_description || ''}
                        onChange={(e) => setCourseData({ ...courseData, course_full_description: e.target.value })}
                    />
                </div>
                <div>
                    <label>Status</label>
                    <select
                        value={String(courseData?.course_status)}
                        onChange={(e) => setCourseData({ ...courseData, course_status: e.target.value === 'true' })}>
                        <option value="true">Active</option>
                        <option value="false">Locked</option>
                    </select>
                </div>
                <div>
                    <h3>Modules</h3>
                    <button type="button" onClick={addModule}>Add Module</button>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="modules">
                            {(provided) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef}>
                                    {modules.map((module, index) => (
                                        <Draggable key={index} draggableId={String(index)} index={index}>
                                            {(provided) => (
                                                <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <input
                                                        type="text"
                                                        value={module.module_name || ''}
                                                        onChange={(e) => handleModuleChange(index, e.target.value)}
                                                        placeholder={`Module ${module.module_ordinal + 1}`}
                                                    />
                                                    <button type="button" onClick={() => deleteModule(index)}>Delete</button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}

export default UpdateCourse;
