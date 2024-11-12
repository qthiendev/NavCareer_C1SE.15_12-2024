import React, { useState, useEffect, Suspense, lazy } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ReadCollection.css';
import 'katex/dist/katex.min.css';

const preprocessMarkdown = (text) => {
    text = text.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    text = text.replace(/\^([^\^]+)\^/g, '<sup>$1</sup>');
    text = text.replace(/~([^~]+)~/g, '<sub>$1</sub>');
    return text;
};

const ReadCollection = () => {
    const navigate = useNavigate();
    const [collectionData, setCollectionData] = useState(null);
    const [eid, setEid] = useState(null);
    const [mid, setMid] = useState(null);
    const [cid, setCid] = useState(null);
    const [grades, setGrades] = useState(null);
    const [mediaFiles, setMediaFiles] = useState({});
    const [enrollmentCheck, setEnrollmentCheck] = useState(false);
    const [resourceCheck, setResourceCheck] = useState(false);
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedModules, setExpandedModules] = useState({});
    const [userAnswers, setUserAnswers] = useState({});
    const [fade, setFade] = useState('fade-in');
    const [highestGrade, setHighestGrade] = useState(null);
    const [attemptCount, setAttemptCount] = useState(null);

    const c = searchParams.get('c');
    const m = searchParams.get('m');
    const co = searchParams.get('co');

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const toggleModule = async (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    useEffect(() => {
        const fetchEnrollmentData = async () => {
            if (!c) return;
            try {
                setLoading(true);
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
    }, [c, navigate]);

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
                setMid(responseData.data.module_id);
                setCid(responseData.data.collection_id);
            } catch (error) {
                console.error('Error fetching collection:', error);
            }
        };

        fetchCollection();
    }, [c, m, co, enrollmentCheck, navigate]);

    useEffect(() => {
        const fetchFrame = async () => {
            if (!collectionData) return;
            try {
                const responseFrame = await axios.get(`http://localhost:5000/edu/frame`, {
                    params: { c },
                    withCredentials: true
                });
                console.log(responseFrame.data.modules);
                setModules(responseFrame.data.modules);
            } catch (error) {
                console.error('Error fetching frame:', error);
            }
        };

        fetchFrame();
    }, [collectionData, c, navigate]);

    useEffect(() => {
        const fetchResources = async () => {
            if (!collectionData) return;

            try {
                setLoading(true);
                const mediaRequests = [];

                for (let key in collectionData) {
                    const materials = collectionData[key].materials;
                    materials.forEach((material) => {
                        if (material.material_type_name === 'Image' || material.material_type_name === 'Video') {
                            const mediaRequest = axios.get('http://localhost:5000/edu/media', {
                                params: { c, m, co, filePath: material.material_content },
                                responseType: 'arraybuffer',
                                withCredentials: true
                            }).then(response => {
                                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                                const url = URL.createObjectURL(blob);
                                return { [material.material_ordinal]: url };
                            });
                            mediaRequests.push(mediaRequest);
                        }
                    });
                }

                const mediaResults = await Promise.all(mediaRequests);
                const mediaFiles = Object.assign({}, ...mediaResults);
                setMediaFiles(mediaFiles);

                setResourceCheck(true);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                sleep(300);
                setLoading(false);
            }
        };

        fetchResources();
    }, [c, m, co, collectionData, navigate]);

    useEffect(() => {
        const getGrade = async () => {
            try {
                if (eid === null || eid === undefined || mid === null || mid === undefined) return;

                const response = await axios.get(`http://localhost:5000/edu/read-grade?eid=${eid}&m=${mid}`, { withCredentials: true });
                if (response.status === 200) {
                    const grades = response.data.grades;
                    setGrades(grades);

                    const attemptCount = grades.length;
                    const highestScore = Math.max(...grades.map(grade => grade.grade_number));

                    setAttemptCount(attemptCount);
                    setHighestGrade(highestScore);
                } else if (response.status === 203) {
                    setGrades([]);
                    setAttemptCount(0);
                    setHighestGrade(null);
                }
            } catch (err) {
                console.error("Failed to fetch grades:", err);
            }
        };

        getGrade();
    }, [eid, mid, navigate]);



    useEffect(() => {
        const fetchTracking = async () => {
            try {
                if (!resourceCheck || eid === null || eid === undefined) return;
                const response = await axios.get(`http://localhost:5000/edu/read-tracking?eid=${eid}`, { withCredentials: true });
                setTracking(response.data || {});
                toggleModule(m);
            } catch (error) {
                console.error('Error fetching tracking:', error);
            }
        };

        fetchTracking();
    }, [resourceCheck, eid, navigate]);

    const handleMarkAsViewed = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/edu/create-tracking?eid=${eid}&cid=${cid}`,
                null,
                { withCredentials: true }
            );
            if (response.status === 200) {
                alert("Đánh dấu thành công");
            } else if (response.status === 201) {
                alert("Đã đánh dấu");
            } else if (response.status === 203) {
                alert("Đánh dấu thất bại");
            }

            const currentModuleIndex = modules.findIndex(module => module.module_ordinal === parseInt(m));
            const currentCollectionIndex = modules[currentModuleIndex].collections.findIndex(
                collection => collection.collection_ordinal === parseInt(co)
            );

            let nextModuleIndex = currentModuleIndex;
            let nextCollectionIndex = currentCollectionIndex + 1;

            if (nextCollectionIndex >= modules[currentModuleIndex].collections.length) {
                nextModuleIndex += 1;
                nextCollectionIndex = 0;
            }

            if (nextModuleIndex < modules.length) {
                const nextModuleOrdinal = modules[nextModuleIndex].module_ordinal;
                const nextCollectionOrdinal = modules[nextModuleIndex].collections[nextCollectionIndex].collection_ordinal;

                navigate(`/edu/collection?c=${c}&m=${nextModuleOrdinal}&co=${nextCollectionOrdinal}`);
            } else {
                alert("Bạn đã xem hết tất cả các collections trong khóa học này.");
            }

            const updatedTracking = { ...tracking, [co]: { collection_id: parseInt(co) } };
            setTracking(updatedTracking);

        } catch (error) {
            console.error("Error marking as viewed:", error);
            alert("Failed to mark as viewed.");
        }
    };

    const handleAnswerChange = (questionOrdinal, answerOrdinal, isChecked) => {
        setUserAnswers((prevAnswers) => {
            const questionAnswers = prevAnswers[questionOrdinal] || [];
            const updatedAnswers = isChecked
                ? [...questionAnswers, answerOrdinal]
                : questionAnswers.filter((ans) => ans !== answerOrdinal);
            return { ...prevAnswers, [questionOrdinal]: updatedAnswers };
        });
    };

    const calculateScore = () => {
        let totalPoints = 0;
        let totalQuestions = 0;

        collectionData.forEach((collection) => {
            collection.materials.forEach((material) => {
                if (material.material_type_name === 'Question') {
                    totalQuestions += 1;
                    const userSelectedAnswers = userAnswers[material.material_ordinal] || [];
                    const correctAnswers = material.answers.filter(ans => ans.answer_is_right).map(ans => ans.answer_ordinal);
                    const totalCorrect = correctAnswers.length;
                    const totalSelectedCorrect = userSelectedAnswers.filter(ans => correctAnswers.includes(ans)).length;
                    const totalSelectedIncorrect = userSelectedAnswers.filter(ans => !correctAnswers.includes(ans)).length;

                    if (material.question_type_name === 'Multiple choice') {
                        if (totalSelectedCorrect === totalCorrect && totalSelectedIncorrect === 0) {
                            totalPoints += 1;
                        }
                    } else {
                        if (totalCorrect > 0) {
                            const point = Math.max(0, (totalSelectedCorrect - totalSelectedIncorrect) / totalCorrect);
                            totalPoints += point;
                        }
                    }
                }
            });
        });

        const percentage = (totalPoints / totalQuestions) * 100;
        return percentage.toFixed(0);
    };

    const renderQuestions = (material) => (
        <div className="read-collection__question" key={material.material_ordinal}>
            <p>{material.material_content}</p>
            <h3>{material.question_description}</h3>
            {material.answers.map((answer) => (
                <div key={answer.answer_ordinal} className="read-collection__answer">
                    <input
                        type={material.question_type_name === 'Multiple choice' ? 'radio' : 'checkbox'}
                        id={`answer-${material.material_ordinal}-${answer.answer_ordinal}`}
                        name={`question-${material.material_ordinal}`}
                        onChange={(e) => handleAnswerChange(material.material_ordinal, answer.answer_ordinal, e.target.checked)}
                    />
                    <label htmlFor={`answer-${material.material_ordinal}-${answer.answer_ordinal}`}>
                        {answer.answer_description}
                    </label>
                </div>
            ))}
        </div>
    );

    const handleSubmitTest = async () => {
        try {
            await axios.post(
                `http://localhost:5000/edu/create-grade?eid=${eid}&m=${mid}&grade=${calculateScore()}`,
                null,
                { withCredentials: true }
            );
            alert('Nộp bài thành công.');
            window.location.reload();
        } catch (err) {
            alert('Nộp bài không thành công, vui lòng thử lại.');
        }
    };

    const handleCollectionClick = (moduleOrdinal, collectionOrdinal) => {
        navigate(`/edu/collection?c=${c}&m=${moduleOrdinal}&co=${collectionOrdinal}`);
    };

    if (loading) {
        return (
            <div className="collection-container">
                <div className="read-collection__loading"></div>
            </div>
        );
    }

    return (
        <div className={`collection-container ${fade}`}>
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
                                        const trackingArray = Object.values(tracking || {}).filter((item) => typeof item === 'object' && item !== null && 'collection_id' in item);
                                        const isTracked = trackingArray.some(item => item.collection_id === collection.collection_id);
                                        const q = collection.collection_type_name === 'Quiz';
                                        const g = highestGrade >= 80;

                                        const isActive = collection.collection_ordinal === parseInt(co) && module.module_ordinal === parseInt(m);

                                        return (
                                            <div
                                                className={`read-collection__collection ${isTracked ? 'tracked' : ''} ${isActive ? 'active' : ''} ${q ? g ? 'qg' : 'q' : ''}`}
                                                key={collection.collection_id}  // Unique key for each collection
                                                onClick={() => handleCollectionClick(module.module_ordinal, collection.collection_ordinal)}
                                            >
                                                {`${moduleIndex + 1}.${collection.collection_ordinal + 1}. ${collection.collection_name}`}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="read-collection__no-collection" key={`${module.module_id}-no-collection`}>
                                        <p>No collections available for this module.</p>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>

                <div className="read-collection__content">
                    <Suspense fallback={<div>Loading content...</div>}>
                        {Object.keys(collectionData).map((key) => {
                            const { collection_name, materials } = collectionData[key];

                            return (
                                <div className="read-collection__item" key={key}>
                                    <h2 className="read-collection__title">{collection_name}</h2>
                                    {collectionData.some((collection) => collection.materials.some((material) =>
                                        material.material_type_name === 'Question'))
                                        && (attemptCount > 0)
                                        && (
                                            <div className="grade-summary">
                                                <p>Số lần thử: {attemptCount}</p>
                                                <p>Điểm cao nhất: {highestGrade}/80</p>
                                            </div>
                                        )}
                                    {collectionData.some((collection) =>
                                        collection.materials.some((material) => material.material_type_name === 'Question')
                                    ) && (attemptCount > 0) && (highestGrade >= 80) && (
                                            <div className="read-collection__congratulations">
                                                <span>
                                                    Chúc mừng! Bạn đã hoàn thành bài kiểm tra thuộc module <strong style={{ color: 'blue' }}>{modules[m]?.module_name || ''}</strong>
                                                </span>
                                                <br />
                                                <span>Bạn có thể nộp lại bài để đạt được số điểm mong muốn.</span>
                                            </div>

                                        )}

                                    {materials.map((material) => {
                                        switch (material.material_type_name) {
                                            case 'Image':
                                                return (
                                                    <img
                                                        key={material.material_ordinal}
                                                        className="read-collection__image"
                                                        src={mediaFiles[material.material_ordinal]}
                                                        alt={`Material ${material.material_ordinal}`}
                                                    />
                                                );

                                            case 'Video':
                                                return (
                                                    <video
                                                        key={material.material_ordinal}
                                                        className="read-collection__video"
                                                        controls
                                                    >
                                                        <source src={mediaFiles[material.material_ordinal]} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                );

                                            case 'Text':
                                                return (
                                                    <ReactMarkdown
                                                        key={material.material_ordinal}
                                                        className="read-collection__text"
                                                        remarkPlugins={[remarkGfm, remarkFootnotes, remarkEmoji, remarkMath]}
                                                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                                                    >
                                                        {preprocessMarkdown(material.material_content)}
                                                    </ReactMarkdown>
                                                );

                                            case 'Question':
                                                return (
                                                    <div key={material.material_ordinal}>
                                                        {renderQuestions(material)}
                                                    </div>
                                                );

                                            default:
                                                return null;
                                        }
                                    })
                                    }
                                </div>
                            );
                        })}
                    </Suspense>

                    <div className="read-collection__buttons-container"></div>
                    {collectionData.every((collection) =>
                        collection.materials.every((material) => material.material_type_name !== 'Question')
                    ) && (
                            <button className="read-collection__button mark-as-viewed-button" onClick={handleMarkAsViewed}>
                                Đã xem
                            </button>
                        )}

                    {collectionData.some((collection) =>
                        collection.materials.some((material) => material.material_type_name === 'Question')
                    ) && (
                            <button className="read-collection__button submit-test-button" onClick={handleSubmitTest}>
                                Nộp bài
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ReadCollection;