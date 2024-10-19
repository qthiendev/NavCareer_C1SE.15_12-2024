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

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/course/read?course_id=${course_id}`, { withCredentials: true });
                console.log(response);
                setCourseData(response.data.data);
                setModules(response.data.data.modules || []);
            } catch (error) {
                alert("Cannot find course");
                navigate(-1);
            }
        };

        fetchCourseData();
    }, [course_id, navigate]);

    useEffect(() => {
        const checkAuth = async () => {
            if (courseData) {
                try {
                    const response = await axios.get('http://localhost:5000/auth/status', { withCredentials: true });
                    if (!response.data.sign_in_status || response.data.aid !== Number.parseInt(courseData.provider_id)) {
                        navigate(-1);
                    } else {
                        setLoading(false);
                    }
                } catch (err) {
                    setErrorMessage('Failed to check authentication status.');
                    console.error('Failed to check authentication status:', err);
                    navigate(-1);
                }
            }
        };

        checkAuth();
    }, [courseData, navigate]);

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        if (!courseData.course_name || !courseData.course_description) {
            setErrorMessage('Course name and description cannot be empty.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/course/update`, {
                course_id: course_id,
                new_course_name: courseData.course_name,
                new_course_description: courseData.course_description,
                new_duration: courseData.duration,
                modules,
            }, { withCredentials: true });
            alert('Course updated successfully');
        } catch (error) {
            setErrorMessage('Failed to update course. Please try again later.');
            console.error('Failed to update course:', error);
        }
    };

    const addModule = () => {
        const newModule = {
            module_ordinal: modules.length,
            module_name: '',
        };
        setModules([...modules, newModule]);
    };

    const handleModuleChange = (index, value) => {
        const newModules = [...modules];
        newModules[index].module_name = value;
        setModules(newModules);
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

    const navigateToViewModule = (module) => {
        navigate(`/course/${course_id}/module/${module.module_ordinal}`);
    };

    const navigateToEditModule = (module) => {
        navigate(`/course/${course_id}/module/${module.module_ordinal}/update`);
    };

    const deleteModule = async (index) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            const updatedModules = modules.filter((_, i) => i !== index);
            setModules(updatedModules);
            try {
                await axios.delete(`http://localhost:5000/course/${course_id}/module/${modules[index].module_ordinal}`, { withCredentials: true });
                alert('Module deleted successfully');
            } catch (error) {
                setErrorMessage('Failed to delete module. Please try again later.');
                console.error('Failed to delete module:', error);
            }
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
                    <label>Course Description</label>
                    <textarea
                        value={courseData?.course_description || ''}
                        onChange={(e) => setCourseData({ ...courseData, course_description: e.target.value })}
                    />
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
                                                    <button type="button" onClick={() => navigateToViewModule(module)}>View</button>
                                                    <button type="button" onClick={() => navigateToEditModule(module)}>Edit</button>
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
                <button type="submit">Update Course</button>
            </form>
        </div>
    );
}

export default UpdateCourse;
