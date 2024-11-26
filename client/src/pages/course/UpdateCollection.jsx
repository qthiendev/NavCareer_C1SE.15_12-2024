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
            let content = '';
            switch (type) {
                case 0:
                    content = 'New Text';
                    break;
                case 1:
                    content = 'image.png';
                    break;
                case 2:
                    content = 'video.mp4';
                case 3:
                    content = 'Question';
                    break;
                default:
                    throw new Error('Invalid material type');
            }

            await axios.post('http://localhost:5000/course/module/collection/material/create', null, {
                params: {
                    material_content: content,
                    material_type_id: type,
                    collection_id,
                },
                withCredentials: true,
            });

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

    const handleMaterialTextUpdate = async (materialId, content) => {
        try {
            await axios.post(
                'http://localhost:5000/course/module/collection/material/update',
                null,
                {
                    params: {
                        collection_id: collection_id,
                        material_id: materialId,
                        material_content: content,
                        material_type_id: 0
                    },
                    withCredentials: true
                });

            navigate(0);
        } catch (error) {
            alert("Cập nhật thất bại");
        }
    };

    const handleMaterialMediaUpdate = async (materialId, file, type, courseId, moduleOrdinal, collectionOrdinal) => {
        try {
            if (!file) {
                alert('Please select a file before updating.');
                return;
            }

            const fileName = file.name;
            const formData = new FormData();
            formData.append('file', file);

            const uploadQueryParams = new URLSearchParams({
                c: courseId,
                m: moduleOrdinal,
                co: collectionOrdinal,
            }).toString();

            const uploadResponse = await axios.post(
                `http://localhost:5000/course/module/collection/material/upload?${uploadQueryParams}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        console.log(`Upload Progress: ${progress}%`);
                    },
                }
            );

            if (uploadResponse.status !== 200) {
                throw new Error('Failed to upload media');
            }

            console.log('Media uploaded successfully:', uploadResponse.data);

            const updateResponse = await axios.post(
                'http://localhost:5000/course/module/collection/material/update',
                null,
                {
                    params: {
                        collection_id: collectionOrdinal,
                        material_id: materialId,
                        material_content: fileName,
                        material_type_id: type === 'Image' ? 1 : 2,
                    },
                    withCredentials: true,
                }
            );

            if (updateResponse.status !== 200) {
                throw new Error('Failed to update material metadata');
            }

            alert('Material updated successfully!');
        } catch (error) {
            console.error('Error in handleMaterialMediaUpdate:', error.message);
            alert('Failed to upload or update material.');
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

    const handleQuestionUpdate = async (materialId, questionId, description, typeId) => {
        try {
            if (!questionId) {
                const createResponse = await axios.post('http://localhost:5000/course/module/collection/question/create', null, {
                    params: {
                        material_id: materialId,
                        question_description: 'New Question',
                        question_type_id: 0,
                    },
                    withCredentials: true,
                });

                const newQuestion = createResponse.data;

                setMaterials(
                    materials.map((m) =>
                        m.material_id === materialId
                            ? { ...m, questions: [newQuestion] }
                            : m
                    )
                );

                navigate(0);
            } else {
                await axios.post('http://localhost:5000/course/module/collection/question/update', null, {
                    params: {
                        material_id: materialId,
                        question_id: questionId,
                        question_description: description,
                        question_type_id: typeId,
                    },
                    withCredentials: true,
                });
                alert('Question updated successfully!');
            }

            navigate(0); // Refresh page to reflect changes
        } catch (error) {
            console.error('Failed to create/update question:', error);
            alert('Failed to create/update question.');
        }
    };


    const handleAnswerCreate = async (questionId) => {
        try {
            const response = await axios.post('http://localhost:5000/course/module/collection/answer/create', null, {
                params: {
                    question_id: questionId,
                    answer_description: 'New Answer',
                    answer_is_right: 0,
                },
                withCredentials: true,
            });
            const updatedMaterials = materials.map((material) =>
                material.questions?.[0]?.question_id === questionId
                    ? { ...material, questions: [{ ...material.questions[0], answers: [...material.questions[0].answers, response.data] }] }
                    : material
            );
            setMaterials(updatedMaterials);
            navigate(0);
        } catch (error) {
            console.error('Failed to create answer:', error);
            alert('Failed to create answer.');
        }
    };

    const handleAnswerUpdate = async (answerId, description, isRight) => {
        try {
            await axios.post('http://localhost:5000/course/module/collection/answer/update', null, {
                params: {
                    answer_id: answerId,
                    answer_description: description,
                    answer_is_right: isRight,
                },
                withCredentials: true,
            });
            alert('Answer updated successfully!');
            navigate(0);
        } catch (error) {
            console.error('Failed to update answer:', error);
            alert('Failed to update answer.');
        }
    };

    const handleAnswerDelete = async (answerId, questionId) => {
        try {
            await axios.post('http://localhost:5000/course/module/collection/answer/delete', null, {
                params: { answer_id: answerId },
                withCredentials: true,
            });
            const updatedMaterials = materials.map((material) =>
                material.questions?.[0]?.question_id === questionId
                    ? { ...material, questions: [{ ...material.questions[0], answers: material.questions[0].answers.filter((a) => a.answer_id !== answerId) }] }
                    : material
            );
            setMaterials(updatedMaterials);
        } catch (error) {
            console.error('Failed to delete answer:', error);
            alert('Failed to delete answer.');
        }
    };

    const handleAnswerOrdinalChange = async (answerId, questionId, newOrdinal) => {
        try {
            const question = materials.find((material) => material.questions?.[0]?.question_id === questionId).questions[0];
            const targetAnswer = question.answers.find((a) => a.answer_ordinal === newOrdinal);
            if (!targetAnswer || targetAnswer.answer_id === answerId) return;

            await axios.post('http://localhost:5000/course/module/collection/answer/ordinal', null, {
                params: {
                    answer_id_1: answerId,
                    answer_id_2: targetAnswer.answer_id,
                },
                withCredentials: true,
            });
            alert('Answer order updated successfully!');
            navigate(0);
        } catch (error) {
            console.error('Failed to update answer ordinal:', error);
            alert('Failed to update answer ordinal.');
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
                <button onClick={handleCollectionUpdate}>Cập nhật</button>
            </div>

            <div className="materials-section">
                <h3>Materials</h3>
                {materials.map((material) => (
                    <div key={material.material_id} className="material-item">
                        {material.material_type_name === 'Text' && (
                            <div>
                                <textarea
                                    value={material.local_content || material.material_content}
                                    maxLength={1000}
                                    onChange={(e) => {
                                        const updatedMaterials = materials.map((m) =>
                                            m.material_id === material.material_id
                                                ? { ...m, local_content: e.target.value }
                                                : m
                                        );
                                        setMaterials(updatedMaterials);
                                    }}
                                />
                                <button
                                    onClick={() => handleMaterialTextUpdate(
                                        material.material_id,
                                        material.local_content || material.material_content
                                    )}
                                >
                                    Update
                                </button>
                            </div>
                        )}
                        {material.material_type_name === 'Image' && (
                            <div>
                                <img
                                    src={material.local_content || mediaUrls[material.material_ordinal]}
                                    alt="material"
                                    style={{ width: '100%' }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const updatedMaterials = materials.map((m) =>
                                            m.material_id === material.material_id
                                                ? { ...m, local_content: URL.createObjectURL(file), file }
                                                : m
                                        );
                                        setMaterials(updatedMaterials);
                                    }}
                                />
                                <button
                                    onClick={() =>
                                        handleMaterialMediaUpdate(
                                            material.material_id,
                                            material.file,
                                            'Image',
                                            course_id,
                                            moduleOrdinal,
                                            collectionOrdinal
                                        )
                                    }
                                >
                                    Update
                                </button>
                            </div>
                        )}

                        {material.material_type_name === 'Video' && (
                            <div>
                                <video
                                    controls
                                    src={material.local_content || mediaUrls[material.material_ordinal]}
                                    style={{ width: '100%' }}
                                />
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const updatedMaterials = materials.map((m) =>
                                            m.material_id === material.material_id
                                                ? { ...m, local_content: URL.createObjectURL(file), file }
                                                : m
                                        );
                                        setMaterials(updatedMaterials);
                                    }}
                                />
                                <button
                                    onClick={() =>
                                        handleMaterialMediaUpdate(
                                            material.material_id,
                                            material.file,
                                            'Video',
                                            course_id,
                                            moduleOrdinal,
                                            collectionOrdinal
                                        )
                                    }
                                >
                                    Update
                                </button>
                            </div>
                        )}

                        {material.material_type_name === 'Question' && (
                            <div>
                                {!material.questions?.[0] ? (
                                    // If no question exists, show the Initialize Question button only
                                    <button
                                        onClick={() =>
                                            handleQuestionUpdate(
                                                material.material_id,
                                                null, // No question ID since we are initializing
                                                null, // No description yet
                                                0 // Default question type
                                            )
                                        }
                                    >
                                        Initialize Question
                                    </button>
                                ) : (
                                    // If question exists, show inputs for description, type, and answers
                                    <div>
                                        <textarea
                                            value={material.questions[0].question_description}
                                            onChange={(e) =>
                                                setMaterials(
                                                    materials.map((m) =>
                                                        m.material_id === material.material_id
                                                            ? {
                                                                ...m,
                                                                questions: [{
                                                                    ...m.questions[0],
                                                                    question_description: e.target.value
                                                                }]
                                                            }
                                                            : m
                                                    )
                                                )
                                            }
                                        />
                                        <select
                                            value={material.questions[0].question_type_id || 0}
                                            onChange={(e) =>
                                                setMaterials(
                                                    materials.map((m) =>
                                                        m.material_id === material.material_id
                                                            ? {
                                                                ...m,
                                                                questions: [{
                                                                    ...m.questions[0],
                                                                    question_type_id: Number(e.target.value)
                                                                }]
                                                            }
                                                            : m
                                                    )
                                                )
                                            }
                                        >
                                            <option value={0}>Multiple Choice</option>
                                            <option value={1}>Multiple Response</option>
                                        </select>
                                        <button
                                            onClick={() =>
                                                handleQuestionUpdate(
                                                    material.material_id,
                                                    material.questions[0].question_id,
                                                    material.questions[0].question_description,
                                                    material.questions[0].question_type_id
                                                )
                                            }
                                        >
                                            Update Question
                                        </button>
                                        <div>
                                            <h4>Answers</h4>
                                            {material.questions[0].answers.map((answer) => (
                                                <div key={answer.answer_id}>
                                                    <input
                                                        type="text"
                                                        value={answer.answer_description}
                                                        onChange={(e) =>
                                                            setMaterials(
                                                                materials.map((m) =>
                                                                    m.material_id === material.material_id
                                                                        ? {
                                                                            ...m,
                                                                            questions: [{
                                                                                ...m.questions[0],
                                                                                answers: m.questions[0].answers.map((a) =>
                                                                                    a.answer_id === answer.answer_id
                                                                                        ? { ...a, answer_description: e.target.value }
                                                                                        : a
                                                                                )
                                                                            }]
                                                                        }
                                                                        : m
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="checkbox"
                                                        checked={answer.answer_is_right}
                                                        onChange={(e) =>
                                                            setMaterials(
                                                                materials.map((m) =>
                                                                    m.material_id === material.material_id
                                                                        ? {
                                                                            ...m,
                                                                            questions: [{
                                                                                ...m.questions[0],
                                                                                answers: m.questions[0].answers.map((a) =>
                                                                                    a.answer_id === answer.answer_id
                                                                                        ? { ...a, answer_is_right: e.target.checked }
                                                                                        : a
                                                                                )
                                                                            }]
                                                                        }
                                                                        : m
                                                                )
                                                            )
                                                        }
                                                    />
                                                    <select
                                                        value={answer.answer_ordinal}
                                                        onChange={(e) =>
                                                            handleAnswerOrdinalChange(
                                                                answer.answer_id,
                                                                material.questions[0].question_id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                    >
                                                        {material.questions[0].answers.map((a) => (
                                                            <option key={a.answer_id} value={a.answer_ordinal}>
                                                                {a.answer_ordinal}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() =>
                                                            handleAnswerUpdate(answer.answer_id, answer.answer_description, answer.answer_is_right)
                                                        }
                                                    >
                                                        Update Answer
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAnswerDelete(answer.answer_id, material.questions[0].question_id)
                                                        }
                                                    >
                                                        Delete Answer
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => handleAnswerCreate(material.questions[0].question_id)}>Add Answer</button>
                                        </div>
                                    </div>
                                )}
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
                <button onClick={() => handleMaterialCreate(3)}>Add Question</button>
            </div>
        </div>
    );
};

export default UpdateCollection;
