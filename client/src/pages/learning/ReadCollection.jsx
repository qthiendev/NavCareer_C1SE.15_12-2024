import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ReadCollection.css';

const renderQuestions = (material) => {
    return (
        <div className="read-collection__question">
            <h3>
                Question {material.material_ordinal}: {material.material_content}
            </h3>
            <p>{material.question_description}</p>
            {material.answers.map((answer) => (
                <div key={answer.answer_ordinal} className="read-collection__answer">
                    <input
                        type={material.question_type_name === 'Multiple choice' ? 'radio' : 'checkbox'}
                        id={`answer-${material.material_ordinal}-${answer.answer_ordinal}`}
                        name={`question-${material.material_ordinal}`}
                    />
                    <label htmlFor={`answer-${material.material_ordinal}-${answer.answer_ordinal}`}>
                        {answer.answer_ordinal}. {answer.answer_description}
                    </label>
                </div>
            ))}
        </div>
    );
};

const ReadCollection = () => {
    const navigate = useNavigate();
    const [collectionData, setCollectionData] = useState(null);
    const [eid, setEid] = useState(null);
    const [mediaFiles, setMediaFiles] = useState({});
    const [enrollmentCheck, setEnrollmentCheck] = useState(false);
    const [resourceCheck, setResourceCheck] = useState(false);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedModules, setExpandedModules] = useState({});

    const c = searchParams.get('c');
    const m = searchParams.get('m');
    const co = searchParams.get('co');

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            if (!c) return;
            try {
                const response = await axios.get(`http://localhost:5000/edu/read-enroll-of?course_id=${c}`, { withCredentials: true });
                if (response.status !== 200) {
                    alert('Bạn chưa tham gia khóa học này!');
                    navigate(`/course/${c}`);
                }
                setEid(response.data.enrollment_id);
            } catch (error) {
                console.error('Failed to fetch enrollment data:', error);
                alert('Bạn chưa tham gia khóa học này!');
                navigate(`/course/${c}`);
            } finally {
                setEnrollmentCheck(true);
            }
        };

        fetchEnrollmentData();
    }, [c]);

    useEffect(() => {
        const fetchCollection = async () => {
            if (!c || !m || !co || !enrollmentCheck) return;
            try {
                setLoading(true);
                const responseData = await axios.get(`http://localhost:5000/edu/collection`, {
                    params: { c, m, co },
                    withCredentials: true
                });
                setCollectionData(responseData.data.collections);

                const responseFrame = await axios.get(`http://localhost:5000/edu/frame`, {
                    params: { c },
                    withCredentials: true
                });
                setModules(responseFrame.data.modules);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        fetchCollection();
    }, [c, m, co, enrollmentCheck]);

    const toggleModule = (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const fetchResources = async () => {
            if (!collectionData) return;

            try {
                for (let key in collectionData) {
                    const materials = collectionData[key].materials;

                    for (let i = 0; i < materials.length; i++) {
                        const material = materials[i];
                        await delay(500);

                        if (material.material_type_name === 'Image' || material.material_type_name === 'Video') {
                            const mediaResponse = await axios.get(`http://localhost:5000/edu/media`, {
                                params: { c, m, co, filePath: material.material_content },
                                responseType: 'arraybuffer',
                                withCredentials: true
                            });
                            const blob = new Blob([mediaResponse.data], { type: mediaResponse.headers['content-type'] });
                            const url = URL.createObjectURL(blob);
                            setMediaFiles((prevMediaFiles) => ({
                                ...prevMediaFiles,
                                [material.material_ordinal]: url
                            }));
                        }
                    }
                }
                setLoading(false);
                setResourceCheck(true);
            } catch (error) {
                console.error('Error fetching resources:', error);
                setLoading(false);
            }
        };

        fetchResources();
    }, [c, m, co, collectionData]);

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                if (!resourceCheck || eid === null || eid === undefined) return;
                const response = await axios.get(`http://localhost:5000/edu/read-tracking?eid=${eid}`, { withCredentials: true });
                setTracking(response.data || {});
            } catch (error) {
                console.error('Error fetching tracking:', error);
            }
        };

        fetchTracking();
    }, [resourceCheck, eid]);

    const handleCollectionClick = (moduleOrdinal, collectionOrdinal) => {
        setSearchParams({ c, m: moduleOrdinal, co: collectionOrdinal });
        window.location.reload();
    };

    const trackingArray = Object.values(tracking || {}).filter(
        (item) => typeof item === 'object' && item !== null && 'collection_id' in item
    );

    const handleMarkAsViewed = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/edu/create-tracking?eid=${eid}&cid=${co}`, null, { withCredentials: true });
            if (response.status === 200) {
                alert("Đánh dấu thành công");
            } else if (response.status === 201) {
                alert("Đã đánh dấu");
            } else if (response.status === 203) {
                alert("Đánh dấu thất bại");
            }
            window.location.reload();
        } catch (error) {
            console.error("Error marking as viewed:", error);
            alert("Failed to mark as viewed.");
        }
    };

    if (loading) {
        return <div className="read-collection__loading">Loading resources...</div>;
    }

    return (
        <div className="collection-container">
            <div className="read-collection">
                <div className="read-collection__sidebar">
                    {modules.map((module, moduleIndex) => (
                        <div className="read-collection__module" key={module.module_id}>
                            <h2 onClick={() => toggleModule(module.module_id)} className="read-collection__module-header">
                                {`${moduleIndex + 1}. ${module.module_name}`}
                            </h2>
                            {expandedModules[module.module_id] && (
                                module.collections.length > 0 ? (
                                    module.collections.map((collection) => {
                                        const isTracked = trackingArray.some(item => item.collection_id === collection.collection_id);
                                        const isActive = collection.collection_ordinal === parseInt(co) && module.module_ordinal === parseInt(m);

                                        return (
                                            <div
                                                className={`read-collection__collection ${isTracked ? 'tracked' : ''} ${isActive ? 'active' : ''}`}
                                                key={collection.collection_id}
                                                onClick={() => handleCollectionClick(module.module_ordinal, collection.collection_ordinal)}
                                            >
                                                {`${moduleIndex + 1}.${collection.collection_ordinal + 1}. ${collection.collection_name}`}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="read-collection__no-collection">
                                        <p>No collections available for this module.</p>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>

                <div className="read-collection__content">
                    {Object.keys(collectionData).map((key) => {
                        const { collection_name, materials } = collectionData[key];

                        return (
                            <div className="read-collection__item" key={key}>
                                <h2 className="read-collection__title">{collection_name}</h2>
                                {materials.map((material, index) => {
                                    switch (material.material_type_name) {
                                        case 'Image':
                                            return (
                                                <img
                                                    key={index}
                                                    className="read-collection__image"
                                                    src={mediaFiles[material.material_ordinal]}
                                                    alt={`Material ${material.material_ordinal}`}
                                                />
                                            );

                                        case 'Video':
                                            return (
                                                <video
                                                    key={index}
                                                    className="read-collection__video"
                                                    controls>
                                                    <source src={mediaFiles[material.material_ordinal]} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            );

                                        case 'Text':
                                            return (
                                                <pre key={index} className="read-collection__text">{material.material_content}</pre>
                                            );

                                        case 'Question':
                                            return renderQuestions(material);

                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <button className="mark-as-viewed-button" onClick={handleMarkAsViewed}>
                Đã xem
            </button>
        </div>
    );
};

export default ReadCollection;
