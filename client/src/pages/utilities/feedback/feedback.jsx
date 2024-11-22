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
            const response = await axios.post('http://localhost:5000/feedback/createFeedback', { description });
            if (response.status === 201) { // Kiểm tra status code
                setMessage('Cảm ơn vì góp ý của bạn!'); // Sử dụng response.data để lấy thông tin
                setDescription('');

            } else {
                console.log('Có lỗi xảy ra.');
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Lỗi:', err.message);
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
        }
        
    }



    return (
        <div>
            <div className='feedback'>
                <div className='feedback-container'>
                    <div className='feedback-header'>
                        <h1>Hệ thống có bất kì lỗi gì mong bạn góp ý cho chúng tôi nhé!</h1>
                    </div>
                    <form className='feedback-form' onSubmit={handleSubmit}>
                        <div className='feedback-form-group'>
                            <input type='text' 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Hãy cho tôi ý kiến của bạn về hệ thống'/>
                        </div>
                        <div className='feedback-form-group'>
                            <button type='submit' >Gửi</button>
                        </div>
                    </form>
                    {message && <div className="feedback-success">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default Feedback;