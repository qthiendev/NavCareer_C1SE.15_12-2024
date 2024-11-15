import { useState } from 'react';
import './servey.css';

function Servey() {
    const [activeTab, setActiveTab] = useState("1");
    const [answers, setAnswers] = useState({
        "1": [],
        "2": Array(10).fill(null),
        "3": Array(10).fill(null),
        "4": Array(10).fill(null),
        "5": []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const questions = {
        "2": [
            "1. Tự mua và lắp ráp máy vi tính theo ý mình",
            "2. Lắp ráp tủ theo hướng dẫn của sách hướng dẫn hoặc trang mạng",
            "3. Tháo mở điện thoại di động hay máy tính ra để tìm hiểu",
            "4. Đoán lỗi khi máy tính tắt đột ngột",
            "5. Đoán lỗi và sửa chữa máy tính khi có sự cố",
            "6. Cài đặt phần mềm mới vào máy tính",
            "7. Xây dựng hệ thống mạng gia đình",
            "8. Cài đặt hệ điều hành trên máy tính mới",
            "9. Cập nhật phần mềm và hệ điều hành cho máy tính",
            "10. Sửa chữa các thiết bị điện tử đơn giản tại nhà"
        ],
        "3": [
            "1. Trang điểm cho mình hay cho bạn theo hướng dẫn của sách hướng dẫn hoặc trang mạng",
            "2. Thiết kế một bộ trang phục theo phong cách riêng",
            "3. Sáng tác một bức tranh hoặc bản vẽ nghệ thuật",
            "4. Chụp và chỉnh sửa ảnh theo phong cách cá nhân",
            "5. Viết một bài thơ hoặc câu chuyện ngắn",
            "6. Trang trí phòng theo chủ đề mình yêu thích",
            "7. Sáng tác hoặc phối nhạc cho một bài hát",
            "8. Thiết kế thiệp chúc mừng cho bạn bè hoặc gia đình",
            "9. Tham gia các buổi diễn văn nghệ hoặc sự kiện nghệ thuật",
            "10. Thử tạo một video ngắn với nội dung sáng tạo"
        ],
        "4": [
            "1. Cắt tỉa cây cảnh trong vườn",
            "2. Tự trồng và chăm sóc cây trong nhà",
            "3. Làm vườn theo cách thân thiện với môi trường",
            "4. Thực hiện các công việc thủ công như đan lát, thêu thùa",
            "5. Tự làm đồ trang trí từ vật liệu tái chế",
            "6. Làm đồ gốm hoặc thủ công mỹ nghệ",
            "7. Chăm sóc và trang trí khu vườn",
            "8. Học cách ghép cành cây để tạo cây mới",
            "9. Tự làm các loại phân bón hữu cơ từ thực phẩm thừa",
            "10. Thử làm một dự án thủ công DIY như làm nến hoặc xà phòng"
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
        setAnswers(prev => ({ ...prev, [tab]: newAnswers }));
    };

    const isAllAnswered = () => {
        const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
        return allAnswers.every(answer => answer !== null);
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setErrorMessage("");
        const allAnswers = [...answers["2"], ...answers["3"], ...answers["4"]];
        const formattedData = `{${allAnswers.join(',')}}`;

        fetch(`http://localhost:5000/utl/predict?data=${formattedData}`)
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                if (data.predicted_code) {
                    setResult(data.predicted_code.split(", ")[2]);
                } else {
                    setErrorMessage("Prediction failed. Please try again.");
                }
            })
            .catch(error => {
                setIsLoading(false);
                setErrorMessage("An error occurred. Please try again later.");
                console.error("Request failed:", error);
            });
    };

    return (
        <div className="servey">
            <div className="container">
                <div className="progress-bar">
                    {[1, 2, 3, 4, 5].map(tabNum => (
                        <div 
                            key={tabNum}
                            className={`tablinks ${activeTab === tabNum.toString() ? 'active' : ''}`}
                            onClick={() => openCity(tabNum.toString())}
                        >
                            <div className='active-number'>
                                <span className='number'>{tabNum}</span>
                            </div>
                            <div className="active-content">
                                {tabNum === 1 ? 'Bắt đầu' : tabNum === 2 ? 'Nhóm 1' : tabNum === 3 ? 'Nhóm 2' : tabNum === 4 ? 'Nhóm 3' : 'Kết quả'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='servey-content'>
                    {activeTab === "1" && (
                        <div className='hello'>
                            <div className='hello-name'>
                                <h2 className='hello-text'>Chào mừng bạn đến với khảo sát!</h2>
                                <p className='hello-text'>Chúng tôi rất cảm ơn sự tham gia của bạn...</p>
                            </div>
                        </div>
                    )}

                    {["2", "3", "4"].includes(activeTab) && (
                        <div className='box-question'>
                            {questions[activeTab].map((question, index) => (
                                <div className='question' key={index}>
                                    <div className="cover-question">
                                        <div className="tabcontent">{question}</div>
                                        <div className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <div className='box-radio' key={value}>
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
                    )}

                    {activeTab === "5" && (
                        <div className="result-container">
                            {isLoading ? (
                                <div className="fancy-loading">
                                    <div className="spinner"></div>
                                    <p>Đang tải kết quả của bạn...</p>
                                </div>
                            ) : result ? (
                                <div className="fancy-result">
                                    <h3>Kết quả dự đoán nghề nghiệp của bạn là:</h3>
                                    <h2 className="job-title">{result}</h2>
                                </div>
                            ) : (
                                <p className="error-message">Please complete all questions before submitting.</p>
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
                    <button 
                        className="next" 
                        onClick={handleNext}
                    >
                        {activeTab === "4" ? "Hoàn thành" : "Tiếp theo"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Servey;
