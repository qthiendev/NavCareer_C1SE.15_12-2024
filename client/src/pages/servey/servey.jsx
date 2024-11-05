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
        "5": [],
        "6": [],
        "7": [],
        "8": [],
    });

    const openCity = (cityName) => {
        setActiveTab(cityName);
    };

    const handleNext = () => {
        if (parseInt(activeTab) < 8) {
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
                    {[1, 2, 3, 4].map(tabNum => (
                        <div 
                            key={tabNum}
                            className={`tablinks ${activeTab === tabNum.toString() ? 'active' : ''}`}
                            onClick={() => openCity(tabNum.toString())}
                        >
                            <div className='active-number'>
                                <span className='number'>{tabNum}</span>
                            </div>
                            <div className="active-content">
                                {tabNum === 1 ? 'Bắt đầu' : tabNum === 2 ? 'Kỹ Thuật' : tabNum === 3 ? 'Nghiên Cứu' : 'Kết quả'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Content Here */}
                <table>
                    <thead className='chose'>
                        <tr>
                            <th></th>
                            <th>Lựa chọn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === "1" && <tr><td colSpan="2">Xin chào</td></tr>}
                        {activeTab === "2" && (
                            <>
                                {["1. Tự mua và lắp ráp máy vi tính theo ý mình", 
                                  "2. Lắp ráp tủ theo hướng dẫn của sách hướng dẫn hoặc trang mạng", 
                                  "3. Trang điểm cho mình hay cho bạn theo hướng dẫn của sách hướng dẫn hoặc trang mạng", 
                                  "4. Cắt tỉa cây cảnh", 
                                  "5. Tháo mở điện thoại di động hay máy tính ra để tìm hiểu"].map((question, index) => (
                                    <tr key={index}>
                                        <td className="tabcontent">{question}</td>
                                        <td className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <label key={value}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q${index}`} 
                                                        value={value} 
                                                        onChange={() => handleRadioChange("2", index, value)} 
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
                                {["1. Tự mua và lắp ráp máy vi tính theo ý mình", 
                                  "2. Lắp ráp tủ theo hướng dẫn của sách hướng dẫn hoặc trang mạng", 
                                  "3. Trang điểm cho mình hay cho bạn theo hướng dẫn của sách hướng dẫn hoặc trang mạng", 
                                  "4. Cắt tỉa cây cảnh", 
                                  "5. Tháo mở điện thoại di động hay máy tính ra để tìm hiểu"].map((question, index) => (
                                    <tr key={index}>
                                        <td className="tabcontent">{question}</td>
                                        <td className="radio-group">
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <label key={value}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q${index}`} 
                                                        value={value} 
                                                        onChange={() => handleRadioChange("3", index, value)} 
                                                    /> 
                                                </label>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                        {activeTab === "4" && (
                            <tr>
                                <td colSpan="2">
                                    <h3>Kết quả</h3>
                                    <p>Tab 2 Score: {calculateScore("2")}</p>
                                    <p>Tab 3 Score: {calculateScore("3")}</p>
                                    {/* Add more scores as needed for other tabs */}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="buttons">
                    <button className="back" onClick={handleBack}>Trở lại</button>
                    <button className="next" onClick={handleNext}>Tiếp theo</button>
                </div>
            </div>
        </div>
    );
}

export default Servey;
