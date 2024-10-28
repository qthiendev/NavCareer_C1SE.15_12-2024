import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import axios from 'axios';


function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('welcome'); // Theo dõi luồng hội thoại

  useEffect(() => {
    // Gửi tin nhắn chào mừng khi khởi động
    const welcomeMessage = {
      sender: 'bot',
      text: 'Xin chào! Bạn muốn tôi hỗ trợ những gì?',
    };
      const Consultation = {
        sender: 'bot',
        text: 'Tư vấn khóa học',
      };
      const cost = {
        sender: 'bot',
        text: 'Giá cả khóa học',
      };
      const recommendations = {
        sender: 'bot',
        text: 'Đề xuất khóa học',
      };
      const quickConsultation = {
        sender: 'bot',
        text: 'Tư vấn nhanh',
      };
    setMessages([welcomeMessage,Consultation,cost,recommendations,quickConsultation]);
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newMessage]);
    handleUserInput(input);
    setInput('');
  };

  const handleUserInput = (input) => {
    switch (stage) {
      case 'welcome':
        handleWelcomeOption(input);
        break;
      case 'courseConsultation':
        handleCourseConsultation(input);
        break;
      case 'priceInquiry':
        handlePriceInquiry(input);
        break;
      case 'courseRecommendation':
        handleCourseRecommendation();
        break;
      case 'quickConsultation':
        handleQuickConsultation(input);
        break;
      case 'awaitingPriceInfo':
        handleAwaitingPriceInfo(input);
        break;
      // case 'awaitingField':
      //   handleAwaitingField(input);
      //   break;
      default:
        break;
    }
  };

  // Xử lý lựa chọn ban đầu
  const handleWelcomeOption = (input) => {
    const lowerInput = input.toLowerCase();
    const options = ['tư vấn', 'giá', 'đề xuất', 'tư vấn nhanh'];

    // Kiểm tra nếu lowerInput chứa bất kỳ cụm từ nào trong options
    const matchedOption = options.find(option => lowerInput.includes(option));
    
    if (matchedOption) {
      // const responseMessage = { sender: 'bot', text: `Bạn đã chọn: ${lowerInput}` };
      // setMessages(prev => [...prev, responseMessage]);
      // cái này để confim để đây lúc nào cần show bot lấy chuỗi nào của client 
      if (matchedOption.includes('tư vấn')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn đã làm trắc nghiệm khảo sát để xem mình thuộc lĩnh vực phù hợp nào chưa? Nếu bạn có chuyên ngành mình yêu thích rồi thì hãy cho tớ biết nhé!' }]);
        setStage('courseConsultation');
      } else if (matchedOption.includes('giá')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Vui lòng cho tôi biết lĩnh vực và khoảng giá mà bạn quan tâm (ví dụ: "khoa học", từ 500k đến 2 triệu).' }]);
        setStage('awaitingPriceInfo');
      } else if (matchedOption.includes('đề xuất')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Trên đây là một số khóa học được nhiều người tham gia nhất' }]);
        setStage('courseRecommendation');
      } else if (matchedOption.includes('tư vấn nhanh')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Hãy chia sẻ một số thông tin về sở thích và mục tiêu nghề nghiệp của bạn để tôi có thể đưa ra tư vấn phù hợp.' }]);
        setStage('quickConsultation');
      }
    } else {
      const errorMessage = { sender: 'bot', text: 'Xin lỗi, tôi không hiểu. Vui lòng chọn một trong các tùy chọn.' };
      setMessages(prev => [...prev, errorMessage]);
    }
};


  // Tư vấn khóa học
  
  const [awaitingCourseName, setAwaitingCourseName] = useState(false);

const handleCourseConsultation = async (input) => {
    const lowerInput = input.toLowerCase(); // Chuyển input về chữ thường để dễ so sánh
  
    // Xử lý khi người dùng nhập "chưa"
    if (lowerInput.includes('chưa')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn hãy nhấn vào đây để làm thử bài test nhằm hiểu rõ hơn về lĩnh vực phù hợp nhé! ' }]);
    } 
    else if (lowerInput.includes('rồi') || lowerInput.includes('xong')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn thuộc lĩnh vực nào nhỉ? Vui lòng nhập tên khóa học bạn quan tâm.' }]);
        
        // Đặt biến cờ để chờ người dùng nhập tên khóa học
        setAwaitingCourseName(true);
    } 
    else if (awaitingCourseName) {
        await sendMessageToBot(input);
        setAwaitingCourseName(false);
      } 
    else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, vui lòng trả lời có chứa từ "rồi" hoặc "chưa" để tôi có thể hỗ trợ bạn.' }]);
    }
};

// Ví dụ về biến state để quản lý việc đang chờ tên khóa học
  const sendMessageToBot = async (input) => {
    try {
        // Call the API with the user's input
        const response = await axios.get('http://localhost:5000/chatbot/GetCourse');
        // Check if the response contains a courses array
        if (response.data.courses && response.data.courses.length > 0) {
            const matchedCourse = response.data.courses.find(course => course.course_name.toLowerCase() === input.toLowerCase());
            if (matchedCourse) {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: `Khóa học: ${matchedCourse.course_name}\n` +
                              `Mô tả: ${matchedCourse.course_short_description}\n` +
                              `Giá: ${matchedCourse.course_price} VND\n` +
                              `Thời lượng: ${matchedCourse.course_duration}\n` +
                              `Liên kết: ${matchedCourse.course_resource_url}`
                    }
                ]);
                setMessages(prev => [...prev, { sender: 'bot', text: 'Trên đây là những khóa học mà chúng tôi có thể gửi đến bạn. Bạn muốn tôi tư vấn thêm cho bạn không?' }]);
                setStage('welcome');
            } 
            else {
                console.log('Không tìm thấy khóa học phù hợp với tên đã nhập.');
                setMessages(prev => [...prev, { sender: 'bot', text: 'Không tìm thấy khóa học phù hợp với tên đã nhập.' }]);
            }
          

        } 
        else {
            console.log(response.data.message || 'Không có khóa học nào.');
            setMessages(prev => [...prev, { sender: 'bot', text: response.data.message || 'Không có khóa học nào.' }]);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setMessages(prev => [...prev, { sender: 'bot', text: 'Có lỗi xảy ra khi kết nối với hệ thống.' }]);
    }
};


  // Xử lý giá cả khóa học
  const handlePriceInquiry = async (input) => {
    setMessages(prev => [...prev, { sender: 'bot', text: 'Vui lòng cho tôi biết lĩnh vực và khoảng giá mà bạn quan tâm (ví dụ: "khoa học", từ 500k đến 2 triệu).' }]);
    setStage('awaitingPriceInfo'); 
  };

  const handleAwaitingPriceInfo = async (input) => {
    const [field, priceRange] = input.split(','); // Giả sử người dùng nhập lĩnh vực và khoảng giá
    
    try {
      const response = await axios.get('/api/courses');
      const courses = response.data;

      const matchedCourses = courses.filter(course =>
        course.category.toLowerCase().includes(field.toLowerCase()) &&
        course.price >= parseInt(priceRange.split('đến')[0]) &&
        course.price <= parseInt(priceRange.split('đến')[1])
      );

      if (matchedCourses.length > 0) {
        const responseMessages = matchedCourses.map(course =>
          `Khóa học: ${course.name}, Giá: ${course.price} VNĐ`
        );
        setMessages(prev => [...prev, { sender: 'bot', text: responseMessages.join('\n') }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, không tìm thấy khóa học nào phù hợp với thông tin bạn đã cung cấp.' }]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
    }
  };

  // Đề xuất khóa học
  const handleCourseRecommendation = async () => {
    try {
      const response = await axios.get('/api/courses');
      const courses = response.data;
    
      const recommendedCourses = courses.slice(0, 5); // Đề xuất 5 khóa học phổ biến nhất
    
      const responseMessages = recommendedCourses.map(course =>
        `Khóa học đề xuất: ${course.name} (Lĩnh vực: ${course.category})`
      );
      setMessages(prev => [...prev, { sender: 'bot', text: responseMessages.join('\n') }]);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
    }
  };

  // Tư vấn nhanh
  const handleQuickConsultation = async (input) => {
    const responseMessage = { sender: 'bot', text: 'Đang tư vấn, vui lòng chờ...' };
    setMessages(prev => [...prev, responseMessage]);

    try {
      // Gọi API ChatGPT (thay YOUR_CHATGPT_API_URL bằng URL thực tế của bạn)
      const response = await axios.post('YOUR_CHATGPT_API_URL', {
        prompt: `Bạn hãy tư vấn cho tôi về khóa học cho một người có sở thích và mục tiêu nghề nghiệp như sau: "${input}"`,
      });

      const botResponse = response.data; // Giả sử API trả về một chuỗi văn bản
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error fetching data from ChatGPT API', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi gọi API ChatGPT. Vui lòng thử lại sau.' }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
