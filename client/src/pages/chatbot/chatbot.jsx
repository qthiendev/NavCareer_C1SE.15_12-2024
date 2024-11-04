import { useState, useEffect } from 'react';
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
        text: 'Khảo sát nhanh',
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
        case 'courseRecommendation':
          handleCourseRecommendation();
          break;
        case 'quickConsultation':
          handleQuickConsultation(input);
          break;
        case 'awaitingPriceInfo':
          handleAwaitingPriceInfo(input);
          break;
        case 'end':
        handleEnding(input);
        break;
      default:
        break;
    }
  };

  // Xử lý lựa chọn ban đầu
  const changeStage = () => {
    setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn muốn tôi hỗ trợ thêm về tư vấn các khóa học, về giá cả, đề xuất hay khảo sát nhanh' }]);
    setStage('welcome');
  };
  const handleEnding = () =>{
      setMessages(prev => [...prev, { sender: 'bot', text: 'Rất vui vì đã giúp đỡ được bạn một phần nào! Cảm ơn bạn đã sử dụng hệ thống!' }]);
  }
  const handleWelcomeOption = (input) => {
    const lowerInput = input.toLowerCase();
    // Kiểm tra nếu lowerInput chứa bất kỳ cụm từ nào trong options
    
    if (lowerInput) {
      // const responseMessage = { sender: 'bot', text: `Bạn đã chọn: ${lowerInput}` };
      // setMessages(prev => [...prev, responseMessage]);
      // cái này để confim để đây lúc nào cần show bot lấy chuỗi nào của client 
      if (lowerInput.includes('tư vấn')||lowerInput.includes('khóa học')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn đã làm trắc nghiệm khảo sát để xem mình thuộc lĩnh vực phù hợp nào chưa? Nếu bạn có chuyên ngành mình yêu thích rồi thì hãy cho tớ biết nhé!' }]);
        setStage('courseConsultation');
      } else if (lowerInput.includes('giá')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Vui lòng cho tôi biết lĩnh vực và khoảng giá mà bạn quan tâm (ví dụ: lĩnh vực Nghệ Thuật từ 200$ đến 500$ ).' }]);
        setStage('awaitingPriceInfo');
      } else if (lowerInput.includes('đề xuất')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Trên đây là một số khóa học được nhiều người tham gia nhất' }]);
        handleCourseRecommendation();
      } else if (lowerInput.includes('khảo sát')|| lowerInput.includes('nhanh')) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Hãy chia sẻ một số thông tin về sở thích và mục tiêu nghề nghiệp của bạn để tôi có thể đưa ra tư vấn phù hợp.' }]);
        setStage('quickConsultation');
      } else if (lowerInput.includes('cảm ơn')||lowerInput.includes('thanks')) {
          handleEnding();
      }
    }
    else {
      const errorMessage = { sender: 'bot', text: 'Xin lỗi, tôi không hiểu. Vui lòng nhập một trong các tùy chọn.' };
      setMessages(prev => [...prev, errorMessage]);
    }
};
// hàm in ra khóa học mỗi tin nhắn là 1 khóa học dùng vòng for
const displayCourses = (courses, formatCourseText) => {
  
  
  courses.forEach((course, index) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: formatCourseText(course) // Sử dụng hàm định dạng văn bản
        }
      ]);
    }, index * 1000); // 1000ms delay for each message
  });
  
  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      { 
        sender: 'bot', 
        text: 'Trên đây là những khóa học mà chúng tôi có thể gửi đến bạn!' 
      }
    ]);
    changeStage();
  }, courses.length * 1000); // delay based on the number of courses
};

  // Tư vấn khóa học
  
const [awaitingCourseName, setAwaitingCourseName] = useState(false);

const handleCourseConsultation = async (input) => {
    const lowerInput = input.toLowerCase(); // Chuyển input về chữ thường để dễ so sánh
  
    // Xử lý khi người dùng nhập "chưa"
    if (lowerInput.includes('chưa')) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Bạn hãy nhấn vào link dưới đây để làm thử bài test nhằm hiểu rõ hơn về lĩnh vực phù hợp nhé! ' }]);
      
      setMessages(prev => [...prev, { sender: 'bot', text: <div className='linkServey'> <span role="gridcell"><a href="http://localhost:5173/servey" target="_blank" rel="link">http://localhost:5173/servey</a></span>
      </div> }]);
      
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

  const sendMessageToBot = async (input) => {
    try {
        // Call the API with the user's input
        const response = await axios.post('http://localhost:5000/chatbot/GetCourse', {
          fieldName: input,
        });
        // Check if the response contains a courses array
        if (response.data.courses && response.data.courses.length > 0) {
            const matchedCourse = response.data.courses;            
            if (matchedCourse) {
              const defaultFormatCourseText = (course) => {
                return (
                  <div className='courseChat'>
                    <h1>Khóa học: {course.course_name}</h1>
                    <h1>Lĩnh vực: {course.field_name}</h1>
                    <h1>Mô tả: {course.course_short_description}</h1>
                    <h1>Giá: {course.course_price}$ </h1>
                  </div>);
              };
              displayCourses(matchedCourse,defaultFormatCourseText);
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
  const handleAwaitingPriceInfo = async (input) => {
    // Tìm khoảng giá từ input và chuyển đổi sang dạng số
    const prices = input.match(/\d+/g)?.map(Number);
    const fieldName = input.toLowerCase().trim(); // Chuyển input sang chữ thường và loại bỏ khoảng trắng thừa
    const [lowPrice, highPrice] = prices.sort((a, b) => a - b); // Sắp xếp từ nhỏ đến lớn

    
        // Gọi API để lấy danh sách field
        const response = await axios.get('http://localhost:5000/chatbot/getfield');
        const dataField = response.data.Fields; // Giả sử `Fields` là mảng chứa tên lĩnh vực trong dữ liệu trả về
        let matchedField = null; // Khởi tạo biến để lưu trữ kết quả nếu tìm thấy
        for (let field of dataField) {
            // Kiểm tra xem fieldName có chứa tên field không
            if (fieldName.includes(field.field_name.toLowerCase())) {
                matchedField = field;
            }
        }
        if (matchedField) {
          if (prices && prices.length == 2) {
        
            try {
              const response = await axios.post('http://localhost:5000/chatbot/PrizeRange', {
                fieldName: matchedField.field_name,
                minPrize: lowPrice,
                maxPrize: highPrice
              });
              const matchedCourses = response.data.courses;
              if (matchedCourses && matchedCourses.length >0) {
                if (matchedCourses) {
                  const defaultFormatCourseText = (course) => {
                    return (
                      <div className='courseChat'>
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}$ </h1>
                      </div>);
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                }
              }
              else {
                setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, không tìm thấy khóa học nào phù hợp với thông tin bạn đã cung cấp.' }]);
              }
            }
             catch (error) {
              console.error('Error fetching courses by price range:', error);
              setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
             changeStage();
            }
          }
          else if (prices && prices.length == 1) {
            const prize = prices[0];
            if (input.includes('trên')){
              try {
                // Gửi yêu cầu POST với minPrize và maxPrize tới API /Prize 
                const response = await axios.post('http://localhost:5000/chatbot/PrizeRange', {
                fieldName: matchedField.field_name,
                minPrize:prize
                });
          
                const matchedCourses = response.data.courses;
          
                if (matchedCourses) {
                  const defaultFormatCourseText = (course) => {
                    return (
                      `Khóa học: ${course.course_name}\n` +
                      `Mô tả: ${course.course_short_description}\n` +
                      `Giá: ${course.course_price}$\n` 
                    );
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                } else {
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, không tìm thấy khóa học nào phù hợp với mức giá trên! vui lòng thử lại' }]);
                }
              } 
              catch (error) {
                console.error('Error fetching courses by price:', error);
                setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
              }
            }
            else{
              try {
                // Gửi yêu cầu POST với minPrize và maxPrize tới API /Prize 
                const response = await axios.post('http://localhost:5000/chatbot/PrizeRange', {
                fieldName: matchedField.field_name,
                maxPrize:prize
                });
          
                const matchedCourses = response.data.courses;
          
                if (matchedCourses) {
                  const defaultFormatCourseText = (course) => {
                    return (
                      <div className='courseChat'>
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}$ </h1>
                      </div>);
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                } else {
                  setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, không tìm thấy khóa học nào phù hợp trên '}]);
                }
              } 
              catch (error) {
                console.error('Error fetching courses by price:', error);
                setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
              }
            }     
          }
          else {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Vui lòng cung cấp khoảng giá rõ ràng hơn để tôi có thể tìm khóa học phù hợp.' }]);
            setStage('awaitingPriceInfo');
          }
        }
        else{
          setMessages(prev => [...prev, { sender: 'bot', text: 'Tôi không tìm thấy thông tin lĩnh vực nào phù hợp.Dưới đây là một số khóa học đáp ứng khoảng giá mà bạn chọn' }]);
          try {
            // Gửi yêu cầu POST với minPrize và maxPrize tới API /Prize 
            const response = await axios.post('http://localhost:5000/chatbot/PrizeRange', {
            maxPrize:highPrice,
            minPrize:lowPrice
            });
      
            const matchedCourses = response.data.courses;
      
            if (matchedCourses) {
              const defaultFormatCourseText = (course) => {
                return (
                  <div className='courseChat'>
                    <h1>Khóa học: {course.course_name}</h1>
                    <h1>Mô tả: {course.course_short_description}</h1>
                    <h1>Giá: {course.course_price}$ </h1>
                  </div>);
              }
              displayCourses(matchedCourses,defaultFormatCourseText);
            } else {
              setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, không tìm thấy khóa học nào phù hợp trên '}]);
            }
          } 
          catch (error) {
            console.error('Error fetching courses by price:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
          }
        }
  };
  

  // Đề xuất khóa học
  const handleCourseRecommendation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/chatbot/Recomment');
      const matchedCourses = response.data.courses;
    
          if (matchedCourses) {
            const defaultFormatCourseText = (course) => {
              return (
                <div className='courseChat'>
                  <h1>Khóa học: {course.course_name}</h1>
                  <h1>Mô tả: {course.course_short_description}</h1>
                  <h1>Giá: {course.course_price}$ </h1>
                  <h1>Thời Lượng: {course.course_duration} </h1>
                  <h1>Số Thành Viên: {course.enrollment_count}  </h1>

                </div>);
            }
            displayCourses(matchedCourses,defaultFormatCourseText);
          } else {
            setMessages(prev => [...prev, { sender: 'bot', text: 'lỗi không tìm thấy khóa học'}]);
          }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.' }]);
    }
  };


  
const handleQuickConsultation = async (input) => {
  const responseMessage = { sender: 'bot', text: 'Đang tìm câu trả lời, vui lòng chờ...' };
  setMessages(prev => [...prev, responseMessage]);
  const question = ".Which major is suitable for me when I have the following interests: " + input;
  const context = "Customers are not sure which major to choose to suit themselves and they need your help, they provide their interests and from those interests you will suggest suitable majors for them.You are the course provider, the user will provide personal preferences from which you will give an idea of ​​what that person is like and what industry they will belong to. ";
  console.log(question);
  
  try {
      // Gọi Hugging Face API
      const response = await axios.post(
          'https://api-inference.huggingface.co/models/twmkn9/albert-base-v2-squad2', 
          {
              inputs: {
                  question: question,
                  context: context
              }
          },
          {
              headers: {
                  'Authorization': `Bearer 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`, // Thay YOUR_HUGGING_FACE_API_KEY bằng API Key của bạn
                  'Content-Type': 'application/json'
              }
          }
      );

      const answer = response.data?.answer || "Không tìm thấy câu trả lời phù hợp.";
      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
     changeStage();

  } catch (error) {
      console.error('Error fetching data from Hugging Face API', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Đã xảy ra lỗi khi gọi API. Vui lòng thử lại sau.' }]);
     changeStage();
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
