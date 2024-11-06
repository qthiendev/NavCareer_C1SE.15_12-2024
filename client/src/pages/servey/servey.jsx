import { useState } from 'react';
import './servey.css';

function Servey() {
    // State to manage active tab
    const [activeTab, setActiveTab] = useState("1");
    // State to store answers for each tab
    const [answers, setAnswers] = useState({
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
    });

    const openCity = (cityName) => {
        setActiveTab(cityName);
    };


    const handleNext = () => {
        if (parseInt(activeTab) < 5) {
            setActiveTab((prev) => (parseInt(prev) + 1).toString());
        }
    };

    const handleBack = () => {
        if (parseInt(activeTab) > 1) {
            setActiveTab((prev) => (parseInt(prev) - 1).toString());
        }
    };

    const handleRadioChange = (tab, questionIndex, value) => {
        const newAnswers = [...answers[tab]];
        newAnswers[questionIndex] = value; // Store the selected value for the question
        setAnswers(prev => ({ ...prev, [tab]: newAnswers }));
    };

    const calculateScore = (tab) => {
        return answers[tab].reduce((sum, value) => sum + (parseInt(value) || 0), 0);
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
                                {tabNum === 1 ? 'Bắt đầu' : tabNum === 2 ? 'Nhóm 1' : tabNum === 3 ? 'Nhóm 2' :tabNum === 4 ? 'Nhóm 3' : 'Kết quả'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Content Here */}
                <table>
                    <thead className='chose'>
                        <tr>
                            <th></th>
                            <th className='option-chose'>
                                <div className='chose'>
                                    <div className='chose-name'>Lựa chọn</div>
                                </div>
                                <div className='choes-option'>
                                    <div className='a01'>Rất Không Thích</div>
                                    <div className='a02'>Không Thích</div>
                                    <div className='a03'>Bình Thường</div>
                                    <div className='a04'>Thích</div>
                                    <div className='a05'>Rất Thích</div>
                                </div>
                            </th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {activeTab === "1" && <tr><td colSpan="2">Xin chào</td></tr>}
                        {activeTab === "2" && (
                            <>
                                {[
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
                                ].map((question, index) => (
                                    <tr key={index}>
                                        <td className="tabcontent">{question}</td>
                                        <td className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <label key={value}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q${index}`} 
                                                        value={value} 
                                                        checked={answers["2"][index] === value.toString()}
                                                        onChange={() => handleRadioChange("2", index, value.toString())} 
                                                    /> 
                                                </label>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                        {activeTab === "3" && (
                            <>
                                {[  "1. Trang điểm cho mình hay cho bạn theo hướng dẫn của sách hướng dẫn hoặc trang mạng",
                                    "2. Thiết kế một bộ trang phục theo phong cách riêng",
                                    "3. Sáng tác một bức tranh hoặc bản vẽ nghệ thuật",
                                    "4. Chụp và chỉnh sửa ảnh theo phong cách cá nhân",
                                    "5. Viết một bài thơ hoặc câu chuyện ngắn",
                                    "6. Trang trí phòng theo chủ đề mình yêu thích",
                                    "7. Sáng tác hoặc phối nhạc cho một bài hát",
                                    "8. Thiết kế thiệp chúc mừng cho bạn bè hoặc gia đình",
                                    "9. Tham gia các buổi diễn văn nghệ hoặc sự kiện nghệ thuật",
                                    "10. Thử tạo một video ngắn với nội dung sáng tạo"
                                ].map((question, index) => (
                                    <tr key={index}>
                                        <td className="tabcontent">{question}</td>
                                        <td className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <label key={value}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q${index}`} 
                                                        value={value} 
                                                        checked={answers["3"][index] === value.toString()}
                                                        onChange={() => handleRadioChange("3", index, value.toString())} 
                                                    /> 
                                                </label>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                        {activeTab === "4" && (
                            <>
                                {[
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
                                ].map((question, index) => (
                                    <tr key={index}>
                                        <td className="tabcontent">{question}</td>
                                        <td className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <label key={value}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q${index}`} 
                                                        value={value} 
                                                        checked={answers["4"][index] === value.toString()}
                                                        onChange={() => handleRadioChange("4", index, value.toString())} 
                                                    /> 
                                                </label>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                        {activeTab === "5" && (
                            <tr>
                                <td colSpan="2">
                                    <h3>Kết quả</h3>
                                    <p>Nhóm 1 Score: {calculateScore("2")}</p>
                                    <p>Nhóm 2 Score: {calculateScore("3")}</p>
                                    <p>Nhóm 3 Score: {calculateScore("4")}</p>

                                    {/* Add more scores as needed for other tabs */}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

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
                        disabled={activeTab === "5"}
                    >
                        {activeTab === "4" || activeTab === "5" ? "Hoàn thành" : "Tiếp theo"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Servey;
