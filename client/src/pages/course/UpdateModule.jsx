import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateModule.css';

function UpdateModule() {
    const { course_id, module_id } = useParams();
    const [moduleData, setModuleData] = useState({ collections: [] });
    const [collections, setCollections] = useState([]);
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
                navigate('/');
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

    const fetchModuleData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/course/read-full?course_id=${course_id}`, { withCredentials: true });
            const data = response.data;

            const module = data.modules?.find((mod) => mod.module_id === parseInt(module_id));
            if (!module) {
                alert("Cannot find module");
                navigate(-1);
                return;
            }

            setModuleData(module);
            setCollections(module.collections || []);
        } catch (error) {
            alert("Failed to fetch module data");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!course_id || !module_id || !isAuthorized) return;
        fetchModuleData();
    }, [course_id, module_id, isAuthorized, navigate]);

    const handleUpdateModule = async (e) => {
        e.preventDefault();
        if (!moduleData.module_name) {
            setErrorMessage('Module name cannot be empty.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/course/module/update`, null, {
                params: {
                    module_name: moduleData.module_name,
                    course_id,
                    module_id,
                },
                withCredentials: true,
            });
            alert('Module updated successfully');
        } catch (error) {
            setErrorMessage('Failed to update module. Please try again later.');
        }
    };

    const handleOrdinalChange = async (collection_id, newOrdinal) => {
        try {
            const targetCollection = collections.find(
                (col) => col.collection_ordinal === newOrdinal
            );

            if (!targetCollection || targetCollection.collection_id === collection_id) return;

            await axios.post(`http://localhost:5000/course/module/collection/ordinal`, null, {
                params: {
                    module_id,
                    collection_id_1: collection_id,
                    collection_id_2: targetCollection.collection_id,
                },
                withCredentials: true,
            });

            alert('Collection ordinals updated successfully');
            fetchModuleData();
        } catch (error) {
            alert('Failed to update collection ordinals');
        }
    };

    const handleDeleteCollection = async (collection_id) => {
        try {
            await axios.post(`http://localhost:5000/course/update/module/collection/delete`, null, {
                params: {
                    collection_id,
                    module_id,
                },
                withCredentials: true,
            });
            alert('Collection deleted successfully');
            fetchModuleData();
        } catch (error) {
            alert('Failed to delete collection');
        }
    };

    const handleAddCollection = async () => {
        try {
            await axios.post(`http://localhost:5000/course/module/collection/create`, null, {
                params: {
                    collection_name: 'New Collection',
                    collection_type_id: 1,
                    module_id,
                },
                withCredentials: true,
            });
            alert('Collection added successfully');
            fetchModuleData();
        } catch (error) {
            alert('Failed to add collection');
        }
    };

    const handleUpdateCollection = async (collection_id, collection_name, collection_type_id) => {
        try {
            await axios.post(`http://localhost:5000/course/module/collection/update`, null, {
                params: {
                    collection_name,
                    collection_type_id,
                    module_id,
                    collection_id,
                },
                withCredentials: true,
            });
            alert('Collection updated successfully');
            fetchModuleData();
        } catch (error) {
            alert('Failed to update collection');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-module-container">
            <h2>Update Module</h2>
            <form onSubmit={handleUpdateModule}>
                <label>
                    Module Name:
                    <input
                        type="text"
                        value={moduleData.module_name}
                        onChange={(e) => setModuleData({ ...moduleData, module_name: e.target.value })}
                    />
                </label>
                <button type="submit">Update Module</button>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <h3>Collections</h3>
            <ul>
                {collections.map((collection) => (
                    <li key={collection.collection_id}>
                        <div className="collection-item">
                            <input
                                type="text"
                                value={collection.collection_name}
                                onChange={(e) => {
                                    const updatedCollections = collections.map((col) =>
                                        col.collection_id === collection.collection_id
                                            ? { ...col, collection_name: e.target.value }
                                            : col
                                    );
                                    setCollections(updatedCollections);
                                }}
                            />
                            <label>
                                Type:
                                <select
                                    value={collection.collection_type_id}
                                    onChange={(e) => {
                                        const updatedCollections = collections.map((col) =>
                                            col.collection_id === collection.collection_id
                                                ? { ...col, collection_type_id: parseInt(e.target.value) }
                                                : col
                                        );
                                        setCollections(updatedCollections);
                                    }}
                                >
                                    <option value={0}>Lesson</option>
                                    <option value={1}>Quiz</option>
                                </select>
                            </label>
                            <label>
                                Ordinal:
                                <select
                                    value={collection.collection_ordinal}
                                    onChange={(e) =>
                                        handleOrdinalChange(
                                            collection.collection_id,
                                            parseInt(e.target.value)
                                        )
                                    }
                                >
                                    {collections.map((col) => (
                                        <option
                                            key={col.collection_id}
                                            value={col.collection_ordinal}
                                        >
                                            {col.collection_ordinal}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button
                                onClick={() =>
                                    handleUpdateCollection(
                                        collection.collection_id,
                                        collection.collection_name,
                                        collection.collection_type_id
                                    )
                                }
                            >
                                Update
                            </button>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/esp/course/${course_id}/module/${module_id}/collection/${collection.collection_id}/update`
                                    )
                                }
                            >
                                Modify
                            </button>
                            <button onClick={() => handleDeleteCollection(collection.collection_id)}>
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddCollection}>Add New Collection</button>
        </div>
    );
}

export default UpdateModule;
