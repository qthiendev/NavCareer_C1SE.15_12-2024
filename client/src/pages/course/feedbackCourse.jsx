import {useState} from 'react';
import './feedback.css';    

import axios from 'axios';
function Feedback() {
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post(
                'http://localhost:5000/feedback/createFeedback',
                { description },
                { withCredentials: true } // Quan trọng: Để gửi cookie của session
            );
            if (response.status === 201) {
                setMessage('Cảm ơn vì góp ý của bạn!');
                setDescription('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Lỗi:', err.message);
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };



    return (
        <div className="feedback-container">
            <div className="feedback-left">
                <img src="./img/main_content/Register.svg" alt="Feedback" />
            </div>
            <div className="feedback-right">
                <h1>Liên hệ ngay với chúng tôi nếu bạn cần hỗ trợ. ^^</h1>
                <form className='feedback-form' onSubmit={handleSubmit}>
                        <div className='feedback-form-group'>
                            <input type='text' 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Trình bày vấn đề của bạn tại đây!'/>
                        </div>
                        <div className='feedback-form-group'>
                            <button>YÊU CẦU HỖ TRỢ</button>
                        </div>
                </form>
                {message && <div className="feedback-success">{message}</div>}
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}

export default Feedback;