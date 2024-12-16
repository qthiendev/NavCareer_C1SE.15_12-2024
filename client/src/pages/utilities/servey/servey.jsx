import { useState, useEffect } from 'react';
import './servey.css';
import CoursesList from './coursesList';

function Servey() {
    const [activeTab, setActiveTab] = useState("1");
    const [answers, setAnswers] = useState({
        "1": [],
        "2": Array(10).fill(null),
        "3": Array(10).fill(null),
        "4": Array(10).fill(null),
        "5": []
    });
    const [isLoading, setIsLoading] = useState(false); // For result loading
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [jobDescriptions, setJobDescriptions] = useState([]);
    const [availableCareers, setAvailableCareers] = useState([]);
    const [userInputCareer, setUserInputCareer] = useState("");
    const [filteredCareers, setFilteredCareers] = useState([]);
    const [isSatisfied, setIsSatisfied] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);
    const [submissionLoading, setSubmissionLoading] = useState(false); // For satisfaction/alternate-career submission

    const questions = {
        "2": [
            "1)	Bạn là người có tính tự lập và suy nghĩ thực tế.",
            "2)	Bạn là người thường diễn đạt cảm xúc, ý tưởng bằng hành động hơn là lời nói.",
            "3)	Bạn có khả năng phối hợp tay mắt tốt, khéo sử dụng các loại dụng cụ.",
            "4)	Bạn có khả năng tự làm và làm tốt các công việc yêu cầu kỹ thuật, sự khéo léo thay vì thuê thợ (tháo lắp, sửa chữa máy móc và đồ nội thất/ làm vườn/ làm đồ thủ công,…).",
            "5)	Bạn thích làm việc ngoài trời và những hoạt động tương tác với vật dụng, máy móc, cây cối, động vật.",
            "6)	Bạn là người cảm thấy thoải mái khi làm việc một mình, không ưa nắm vai trò lãnh đạo, không thích xã giao.",
            "7)	Bạn là người hưởng thụ và tập trung hoàn toàn vào quá trình làm việc, học tập nên thỉnh thoảng thường quên mất thời gian.",
            "8)	Bạn có thể phân tích và giải quyết các vấn đề một cách hiệu quả, có logic.",
            "9)	Bạn có thể học hỏi và tiếp thu điều mới nhanh chóng, suy nghĩ mạch lạc và chặt chẽ.",
            "10)Bạn thích quan sát, tìm tòi, học hỏi về thế giới xung quanh, đặt những câu hỏi “tại sao, vì đâu, như thế nào?” trong các cuộc trò chuyện."

        ],
        "3": [
            "1)	Bạn là người có khiếu thẩm mĩ, yêu thích cái đẹp, dễ bị hấp dẫn bởi cái đẹp ( thiên nhiên, con người, đồ vật,..).",
            "2)	Bạn là người có cá tính riêng, giàu trí tưởng tượng, nhạy cảm và dễ xúc động.",
            "3)	Bạn có thể thu hút, khiến người khác đồng cảm, quan tâm đến câu chuyện mình chia sẻ theo nhiều cách (thuyết trình/ diễn xuất/ viết, trình bày những ý tưởng của mình,…).",
            "4)	Bạn có thể thực hiện tốt các hoạt động yêu cầu năng khiếu và kỹ năng tưởng tượng, sáng tạo (nhảy/ múa/ rap/ ca hát/ sáng tác/ sử dụng các loại nhạc cụ/ chụp hình/ vẽ tranh/ trang trí/ điêu khắc/ …).",
            "5)	Bạn thích sự tự do, sự đổi mới, sáng tạo liên tục trong công việc và cuộc sống, khó chịu với sự gò ép và khuôn khổ.",
            "6)	Bạn là người quan tâm và luôn sẵn lòng hỗ trợ, muốn làm cho mọi người xung quanh mình hạnh phúc.",
            "7)	Bạn là người có uy tín, biết lắng nghe và dễ đồng cảm, thường được mọi người tìm đến để tâm sự.",
            "8)	Bạn có thể diễn đạt tốt ý tưởng, truyền đạt kiến thức và giải thích các thông tin phức tạp một cách dễ hiểu.",
            "9)	Bạn có thể thực hiện tốt các công việc yêu cầu sự tử tế, kiên nhẫn (như các dịch vụ chăm sóc sức khoẻ/ dịch vụ khách hàng, nhà hàng, khách sạn/ các hoạt động an sinh, công tác xã hội,…).",
            "10)	Bạn thích gặp gỡ, làm việc với con người, tham gia các hoạt động vì mục tiêu chung của cộng đồng, xã hội.",

        ],
        "4": [
            "1)	Bạn là người năng động, có tham vọng, giao tiếp tốt, được nhiều người xung quanh tin tưởng, nể phục.",
            "2)	Bạn là người quyết đoán và không quá chú ý tiểu tiết.",
            "3)	Bạn có thể diễn đạt, tranh luận và thuyết phục người khác đồng ý với ý kiến của mình.",
            "4)	Bạn có thể lên kế hoạch, chiến lược, lãnh đạo đội nhóm để đạt được mục tiêu.",
            "5)	Bạn thích xã giao, sự phiêu lưu và mạo hiểm, các hoạt động tạo ra lợi nhuận.",
            "6)	Bạn là người ngăn nắp, gọn gàng, nhạy bén với các con số, các phép tính toán và cẩn trọng trong chi tiêu.",
            "7)	Bạn là người tuân thủ nguyên tắc, có trách nhiệm trong công việc và đời sống sinh hoạt mà không cần đốc thúc.",
            "8)	Bạn có thể làm việc tốt trong khuôn khổ hệ thống, giải quyết công việc giấy tờ một cách nhanh chóng, hiệu quả và ngăn nắp.",
            "9)	Bạn có thể thực hiện tốt các công việc đòi hỏi phải được lên kế hoạch cẩn thận, tính chất công việc yêu cầu độ chính xác cao.",
            "10)	Bạn thích làm việc với các con số, làm việc theo hướng dẫn, quy trình, lên kế hoạch lịch làm việc, dự kiến các khoản thu chi.",

        ]
    };

    const openCity = (cityName) => setActiveTab(cityName);

    const handleNext = () => {
        if (parseInt(activeTab) < 4) {
            setActiveTab((prev) => (parseInt(prev) + 1).toString());
        } else if (parseInt(activeTab) === 4) {
            if (isAllAnswered()) {
                setActiveTab("5");
                handleSubmit();
            } else {
                setErrorMessage("Please answer all 30 questions before submitting.");
            }
        }
    };

    const handleBack = () => {
        if (parseInt(activeTab) > 1) {
            setActiveTab((prev) => (parseInt(prev) - 1).toString());
        }
    };

    const handleRadioChange = (tab, questionIndex, value) => {
        const newAnswers = [...answers[tab]];
        newAnswers[questionIndex] = value;
        setAnswers((prev) => ({ ...prev, [tab]: newAnswers }));
    };

    const isAllAnswered = () => {
        const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
        return allAnswers.every((answer) => answer !== null);
    };

    const handleSubmit = async () => {
        setIsLoading(true); // Start result loading
        setIsSatisfied(null);
        setErrorMessage("");
        const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
        const formattedData = `{${allAnswers.join(',')}}`;

        await fetch(`http://localhost:5000/utl/predict?data=${formattedData}`)
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false); // Stop result loading
                if (data.predicted_code) {
                    const predictedJob = data.predicted_code.split(", ");
                    setResult(predictedJob); // Set result to display satisfaction-question
                } else {
                    setErrorMessage("Prediction failed. Please try again.");
                }
            })
            .catch((error) => {
                setIsLoading(false); // Stop result loading
                setErrorMessage("An error occurred. Please try again later.");
                console.error("Request failed:", error);
            });
    };

    const handleSatisfactionChange = (satisfied) => {
        setIsSatisfied(satisfied);
        if (satisfied) {
            setSubmissionLoading(true); // Start submission loading
            const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
            const formattedData = `{${allAnswers.join(',')}}`;

            fetch(`http://localhost:5000/utl/predict-save?data=${formattedData}&job_name=${result[2]}`, {
                method: "POST"
            })
                .then(() => {
                    setSubmissionLoading(false); // Stop submission loading
                    setFeedbackMessage("Câu trả lời của bạn đã được ghi nhận!");
                })
                .catch(() => {
                    setSubmissionLoading(false); // Stop submission loading
                    setFeedbackMessage("Lỗi khi gửi câu trả lời, vui lòng thử lại.");
                });
        }
    };

    const handleCareerInput = (e) => {
        const input = e.target.value;
        setUserInputCareer(input);
        if (input) {
            const filtered = availableCareers.filter((career) =>
                career.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCareers(filtered);
        } else {
            setFilteredCareers([]);
        }
    };

    const handleSaveCareer = () => {
        if (!userInputCareer.trim()) {
            alert("Vui lòng nhập hoặc chọn nghề nghiệp.");
            return;
        }

        setSubmissionLoading(true); // Start submission loading
        const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
        const formattedData = `{${allAnswers.join(',')}}`;

        fetch(`http://localhost:5000/utl/predict-save?data=${formattedData}&job_name=${userInputCareer}`, {
            method: "POST"
        })
            .then(() => {
                setSubmissionLoading(false); // Stop submission loading
                setFeedbackMessage("Câu trả lời của bạn đã được ghi nhận!");
            })
            .catch(() => {
                setSubmissionLoading(false); // Stop submission loading
                setFeedbackMessage("Lỗi khi gửi câu trả lời, vui lòng thử lại.");
            });
    };

    useEffect(async () => {
        await fetch("http://localhost:5000/utl/available-career")
            .then((response) => response.json())
            .then((data) => setAvailableCareers(data))
            .catch((error) => console.error("Failed to load available careers:", error));
    }, []);

    useEffect(async () => {
        await fetch("/data/job_desc.json")
            .then(response => response.json())
            .then(data => setJobDescriptions(data))
            .catch(error => console.error("Failed to load job descriptions:", error));
    }, []);

    const getJobDetails = () => {
        if (!result || !jobDescriptions) return null;
        return jobDescriptions.find(job => job.Code === parseInt(result));
    };

    const jobDetails = getJobDetails();

    return (
        <div className="servey">
            <div className="container">
                <div className="progress-bar">
                    {[1, 2, 3, 4, 5].map((tabNum) => (
                        <div
                            key={tabNum}
                            className={`tablinks ${activeTab === tabNum.toString() ? 'active' : ''}`}
                            onClick={() => openCity(tabNum.toString())}
                        >
                            <div className="active-number">
                                <span className="number">{tabNum}</span>
                            </div>
                            <div className="active-content">
                                {tabNum === 1 ? 'Bắt đầu' : tabNum === 2 ? 'Nhóm 1' : tabNum === 3 ? 'Nhóm 2' : tabNum === 4 ? 'Nhóm 3' : 'Kết quả'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="servey-content">
                    {activeTab === "1" && (
                        <div className="hello">
                            <div className="hello-name">
                                <h2 className="hello-text-header">Chào mừng bạn đến với khảo sát!</h2>
                                <p className="hello-text">Chọn câu trả lời đến với mình nhanh và tự nhiên nhất. Càng suy nghĩ thì càng không tốt vì lúc ấy người thực hiện đang suy tính và dùng lý trí để trả lời.</p>
                                <p className="hello-text">Lựa chọn mức độ đồng ý của mình cho mỗi câu ở các phần tiếp theo bằng cách chọn vào ô tương ứng:</p>
                                <p className="hello-text">1.	Bạn thấy ý đó chưa bao giờ đúng với bạn.</p>
                                <p className="hello-text">2.	Chỉ thấy ý đó chỉ đúng trong một vài trường hợp.</p>
                                <p className="hello-text">3.	Bạn thấy ý đó chỉ một nửa là đúng với bạn.</p>
                                <p className="hello-text">4.	Bạn thấy ý đó gần như là đúng với bạn trong hầu hết mọi trường hợp, chỉ có một vài trường hợp là chưa đúng lắm.</p>
                                <p className="hello-text">5.	Bạn thấy ý đó là hoàn toàn đúng với bạn, không thể nào khác đi được.</p>

                                </div>
                        </div>
                    )}

                    {["2", "3", "4"].includes(activeTab) && (
                        <>
                            <div className="chose">
                                <div className="box-chose">
                                    <div className="active-chose">
                                        <div className="box-chose-left"></div>
                                        <div className="box-chose-right">
                                            <div className="chose">
                                                <div className="chose-name">
                                                    <div className="chose-name-left">Lựa chọn</div>
                                                </div>
                                            </div>
                                            <div className="choes-option">
                                                <div className="a01">Rất Không Thích</div>
                                                <div className="a02">Không Thích</div>
                                                <div className="a02">Bình Thường</div>
                                                <div className="a02">Thích</div>
                                                <div className="a02">Rất Thích</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-question">
                                {questions[activeTab].map((question, index) => (
                                    <div className="question" key={index}>
                                        <div className="cover-question">
                                            <div className="tabcontent">{question}</div>
                                            <div className="radio-group">
                                                {[1, 2, 3, 4, 5].map((value) => (
                                                    <div className="box-radio" key={value}>
                                                        <input
                                                            type="radio"
                                                            name={`q${index}`}
                                                            value={value}
                                                            checked={answers[activeTab][index] === value.toString()}
                                                            onChange={() => handleRadioChange(activeTab, index, value.toString())}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === "5" && (
                        <div className="result-container">
                            {isLoading ? (
                                <div className="fancy-loading">
                                    <div className="spinner"></div>
                                    <p>Kết quả có thể mất tới một vài phút để phân tích, vui lòng đợi...</p>
                                </div>
                            ) : result ? (
                                <div className='result-layout-content'>
                                    <div className="result-layout">
                                        <div className="result-text">
                                            <h3 className="job-header">Kết quả dự đoán nghề nghiệp của bạn là:</h3>
                                            <h2 className="job-title">{result[2]}</h2>
                                            
                                            {isSatisfied === null && (
                                                <div className="satisfaction-question">
                                                    <p>Bạn có hài lòng với kết quả này không?</p>
                                                    <button onClick={() => handleSatisfactionChange(true)}>Có</button>
                                                    <button onClick={() => handleSatisfactionChange(false)}>Không</button>
                                                </div>
                                            )}

                                            {isSatisfied === false && feedbackMessage === null && (
                                                <div className="alternate-career">
                                                    <input
                                                        type="text"
                                                        value={userInputCareer}
                                                        onChange={handleCareerInput}
                                                        placeholder="Nhập nghề nghiệp mong muốn"
                                                    />
                                                    {filteredCareers.length > 0 && (
                                                        <ul className="autocomplete-list">
                                                            {filteredCareers.map((career, index) => (
                                                                <li key={index} onClick={() => setUserInputCareer(career)}>
                                                                    {career}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <button onClick={handleSaveCareer} disabled={submissionLoading}>
                                                        {submissionLoading ? "Đang gửi..." : "Gửi câu trả lời"}
                                                    </button>
                                                </div>
                                            )}

                                            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

                                            <p className="job-description">{jobDetails?.Description}</p>
                                        </div>
                                        <div className="result-image">
                                            <img
                                                src={jobDetails?.image_url}
                                                alt={jobDetails?.["Career Name (Vietnamese)"] || "Hình ảnh không khả dụng"}
                                                className="job-image"
                                            />
                                        </div>
                                        
                                    </div>
                                    <div className='List-couses'>
                                        <CoursesList className="CourseList" fieldName={result[2]} />
                                    </div>
                                </div>
                            ) : (
                                <p className="error-message">Không tìm thấy chi tiết công việc. Vui lòng thử lại.</p>
                            )}
                        </div>
                    )}

                </div>

                {errorMessage && activeTab !== "5" && (
                    <div className="error-message">{errorMessage}</div>
                )}

                <div className="buttons">
                    <button
                        className="back"
                        onClick={handleBack}
                        disabled={activeTab === "1"}
                    >
                        Trở lại
                    </button>
                    <button className="next" onClick={handleNext}>
                        {activeTab === "4" ? "Hoàn thành" : "Tiếp theo"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Servey;
