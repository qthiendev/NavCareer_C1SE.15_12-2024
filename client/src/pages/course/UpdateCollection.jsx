import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateCollection.css';

const UpdateCollection = () => {
    const { course_id, module_id, collection_id } = useParams();
    const [moduleOrdinal, setModuleOrdinal] = useState('');
    const [collectionOrdinal, setCollectionOrdinal] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [collectionType, setCollectionType] = useState(0); // 0: Lesson, 1: Quiz
    const [materials, setMaterials] = useState([]);
    const [mediaUrls, setMediaUrls] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/course/read-full?course_id=${course_id}`,
                    { withCredentials: true }
                );
                const module = response.data.modules.find(m => m.module_id === Number(module_id));
                const collection = module.collections.find(c => c.collection_id === Number(collection_id));
                const mediaRequests = [];

                collection.materials.forEach((material) => {
                    if (material.material_type_name === 'Image' || material.material_type_name === 'Video') {
                        const mediaRequest = axios.get('http://localhost:5000/edu/media', {
                            params: {
                                c: course_id,
                                m: module.module_ordinal,
                                co: collection.collection_ordinal,
                                filePath: material.material_content,
                            },
                            responseType: 'arraybuffer',
                            withCredentials: true,
                        }).then(response => {
                            const blob = new Blob([response.data], { type: response.headers['content-type'] });
                            const url = URL.createObjectURL(blob);
                            return { [material.material_ordinal]: url };
                        });
                        mediaRequests.push(mediaRequest);
                    }
                });

                const mediaResults = await Promise.all(mediaRequests);
                const urlMap = mediaResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});

                setModuleOrdinal(module.module_ordinal);
                setCollectionOrdinal(collection.collection_ordinal);
                setCollectionName(collection.collection_name);
                setCollectionType(collection.collection_type_id);
                setMaterials(collection.materials);
                setMediaUrls(urlMap);
            } catch (error) {
                console.error('Error fetching collection:', error);
                setErrorMessage('Failed to load collection data.');
            } finally {
                setLoading(false);
            }
        };
        fetchCollectionData();
    }, [course_id, module_id, collection_id, navigate]);

    const handleCollectionUpdate = async () => {
        try {
            await axios.post('http://localhost:5000/course/module/collection/update', null, {
                params: {
                    collection_name: collectionName,
                    collection_type_id: collectionType,
                    module_id,
                    collection_id,
                },
                withCredentials: true,
            });
            alert('Collection updated successfully!');
        } catch (error) {
            console.error('Failed to update collection:', error);
            setErrorMessage('Failed to update collection.');
        }
    };

    const handleMaterialCreate = async (type) => {
        try {
            const content = type === 0 ? 'New Text' : '';
            const response = await axios.post('http://localhost:5000/course/module/collection/material/create', null, {
                params: {
                    material_content: content,
                    material_type_id: type,
                    collection_id,
                },
                withCredentials: true,
            });
            setMaterials([...materials, response.data]);
            navigate(0);
        } catch (error) {
            console.error('Failed to create material:', error);
            setErrorMessage('Failed to create material.');
        }
    };

    const handleMaterialDelete = async (materialId) => {
        try {
            await axios.post('http://localhost:5000/course/module/collection/material/delete', null, {
                params: {
                    collection_id,
                    material_id: materialId,
                },
                withCredentials: true,
            });
            setMaterials(materials.filter((material) => material.material_id !== materialId));
        } catch (error) {
            console.error('Failed to delete material:', error);
            setErrorMessage('Failed to delete material.');
        }
    };

    const handleMaterialUpdate = async (materialId, content, type) => {
        try {
            const formData = new FormData();
            formData.append('material_content', content);
            formData.append('material_type_id', type);
            formData.append('collection_id', collection_id);
            formData.append('material_id', materialId);

            await axios.post(
                'http://localhost:5000/course/module/collection/material/update',
                formData,
                { withCredentials: true }
            );
            alert('Material updated successfully!');
        } catch (error) {
            console.error('Error updating material:', error);
            setErrorMessage('Failed to update material.');
        }
    };

    const handleFileUpload = async (event, materialId, typeId) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('material_id', materialId);
        formData.append('collection_id', collection_id);
        formData.append('material_type_id', typeId);

        try {
            await axios.post('http://localhost:5000/edu/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Failed to upload file:', error);
            setErrorMessage('Failed to upload file.');
        }
    };

    const handleOrdinalChange = async (materialId, newOrdinal) => {
        try {
            const targetMaterial = materials.find(
                (m) => m.material_ordinal === newOrdinal
            );
            if (!targetMaterial || targetMaterial.material_id === materialId) return;
    
            await axios.post(
                'http://localhost:5000/course/module/collection/material/ordinal',
                null,
                {
                    params: {
                        collection_id,
                        material_id_1: materialId,
                        material_id_2: targetMaterial.material_id, // Swap the two material IDs
                    },
                    withCredentials: true,
                }
            );
    
            // Refresh the page to show updated ordinals
            navigate(0);
        } catch (error) {
            console.error('Failed to update material ordinals:', error);
            alert('Failed to update material ordinals');
        }
    };
    


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="update-collection-container">
            {errorMessage && <div className="error">{errorMessage}</div>}
            <div className="collection-header">
                <h2>Edit Collection</h2>
                <a
                    href={`http://localhost:5173/edu/collection?c=${course_id}&m=${moduleOrdinal}&co=${collectionOrdinal}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-link"
                >
                    Preview
                </a>
            </div>

            <div className="edit-section">
                <label>Collection Name</label>
                <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                />

                <label>Collection Type</label>
                <select
                    value={collectionType}
                    onChange={(e) => setCollectionType(Number(e.target.value))}
                >
                    <option value={0}>Lesson</option>
                    <option value={1}>Quiz</option>
                </select>

                <button onClick={handleCollectionUpdate}>Update Collection</button>
            </div>

            <div className="materials-section">
                <h3>Materials</h3>
                {materials.map((material) => (
                    <div key={material.material_id} className="material-item">
                        {material.material_type_name === 'Text' && (
                            <textarea
                                value={material.material_content}
                                maxLength={1000}
                                onChange={(e) =>
                                    handleMaterialUpdate(material.material_id, e.target.value, 0)
                                }
                            />
                        )}
                        {material.material_type_name === 'Image' && (
                            <div>
                                <img src={mediaUrls[material.material_ordinal]} alt="material" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileUpload(e, material.material_id, 1)
                                    }
                                />
                            </div>
                        )}
                        {material.material_type_name === 'Video' && (
                            <div>
                                <video controls src={mediaUrls[material.material_ordinal]} />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                        handleFileUpload(e, material.material_id, 2)
                                    }
                                />
                            </div>
                        )}
                        <div className="material-actions">
                            <select
                                value={material.material_ordinal}
                                onChange={(e) => {
                                    const newOrdinal = parseInt(e.target.value);

                                    handleOrdinalChange(material.material_id, newOrdinal);
                                }}
                            >
                                {materials.map((m) => (
                                    <option
                                        key={m.material_id}
                                        value={m.material_ordinal}
                                    >
                                        {m.material_ordinal}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleMaterialUpdate(
                                    material.material_id,
                                    material.material_content,
                                    material.material_type_id
                                )}
                            >
                                Update
                            </button>
                            <button onClick={() => handleMaterialDelete(material.material_id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-material-buttons">
                <button onClick={() => handleMaterialCreate(0)}>Add Text</button>
                <button onClick={() => handleMaterialCreate(1)}>Add Image</button>
                <button onClick={() => handleMaterialCreate(2)}>Add Video</button>
            </div>
        </div>
    );
};

export default UpdateCollection;
