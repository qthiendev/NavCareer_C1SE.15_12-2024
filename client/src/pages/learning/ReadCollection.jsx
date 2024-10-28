import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './ReadCollection.css'; // Import your unique CSS file

const ReadCollection = () => {
    const [collectionData, setCollectionData] = useState(null);
    const [frameData, setFrameData] = useState(null);
    const [mediaFiles, setMediaFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]); // State to hold modules
    const [searchParams] = useSearchParams();
    const [expandedModules, setExpandedModules] = useState({}); // Track expanded/collapsed state

    const c = searchParams.get('c');
    const m = searchParams.get('m');
    const co = searchParams.get('co');

    useEffect(() => {
        const fetchCollection = async () => {
            if (
                c !== null && Number.isFinite(Number(c)) &&
                m !== null && Number.isFinite(Number(m)) &&
                co !== null && Number.isFinite(Number(co))
            ) {
                try {
                    const responseData = await axios.get(`http://localhost:5000/edu/collection`, {
                        params: { c, m, co },
                        withCredentials: true
                    });
                    const collections = responseData.data.collections;
                    setCollectionData(collections);

                    const responseFrame = await axios.get(`http://localhost:5000/edu/frame`, {
                        params: { c },
                        withCredentials: true
                    });
                    const modules = responseFrame.data.modules;
                    setFrameData(modules);
                    setModules(modules); // Store modules data

                } catch (error) {
                    console.error('Error fetching collection:', error);
                }
            } else {
                console.warn('Invalid parameters:', { c, m, co });
            }
        };

        fetchCollection();
    }, [c, m, co]);

    const toggleModule = (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId], // Toggle the current module's expanded state
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

                        // Only fetch media for Image and Video types
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
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();
    }, [c, m, co, collectionData]);

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

    if (loading) {
        return <div className="read-collection__loading">Loading...</div>;
    }

    return (
        <div className="collection-container">
            <div className="read-collection">
                <div className="read-collection__sidebar">
                    {/* Render the structured list for modules and collections */}
                    {modules.map((module, moduleIndex) => (
                        <div className="read-collection__module" key={module.module_id}>
                            <h2 onClick={() => toggleModule(module.module_id)} className="read-collection__module-header">
                                {`${moduleIndex + 1}. ${module.module_name}`}
                            </h2>
                            {expandedModules[module.module_id] && (
                                module.collections.length > 0 ? (
                                    module.collections.map((collection) => (
                                        <div className="read-collection__collection" key={collection.collection_id}>
                                            <a href={`/edu/collection?c=${c}&m=${module.module_ordinal}&co=${collection.collection_ordinal}`}>
                                                {`${moduleIndex + 1}.${collection.collection_ordinal + 1}. ${collection.collection_name}`}
                                            </a>
                                        </div>
                                    ))
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
                                    // Handle different material types
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
                                            return renderQuestions(material); // Render questions and answers

                                        default:
                                            return null; // Handle unsupported material types
                                    }
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReadCollection;
