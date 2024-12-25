import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link



function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState('welcome'); // Theo dõi luồng hội thoại
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Cuộn xuống cuối mỗi khi `messages` thay đổi
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  useEffect(() => {
    // Gửi tin nhắn chào mừng khi khởi động
    const welcomeMessage = {
      sender: 'bot',
      text: 'Xin chào! Bạn muốn tôi hỗ trợ những gì?',
    };
      const Consultation = {
        sender: 'bot',
        text: 'Tư vấn khóa học',
        clickable: true
      };
      const cost = {
        sender: 'bot',
        text: 'Giá cả khóa học',
        clickable: true

      };
      const recommendations = {
        sender: 'bot',
        text: 'Đề xuất khóa học',
        clickable: true

      };
      const quickConsultation = {
        sender: 'bot',
        text: 'Khảo sát nhanh',
        clickable: true

      };
    setMessages([welcomeMessage,Consultation,cost,recommendations,quickConsultation]);
  }, []);

  const [showChatbot, setShowChatbot] = useState(true);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  
  const handleClickOption = (text) => {
    setInput(text);
    sendMessage();
  };

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
        case 'awaitingPriceInfo':
          handleAwaitingPriceInfo(input);
          break;
        case 'quickConsultation':
          handleQuickConsultation(input);
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
    const answer= 'Bạn muốn tôi hỗ trợ thêm về tư vấn các khóa học, về giá cả hay đề xuất một vài khóa học không?';
    animateBotResponse(answer)
    setStage('welcome');
  };
  const handleEnding = () =>{
    const answer= 'Rất vui vì đã giúp đỡ được bạn một phần nào! Cảm ơn bạn đã sử dụng hệ thống!';
    animateBotResponse(answer)  
  }
  const handleWelcomeOption = (input) => {
    const lowerInput = input.toLowerCase();
    // Kiểm tra nếu lowerInput chứa bất kỳ cụm từ nào trong options
    
    if (lowerInput) {
      
      if (lowerInput.includes('tư vấn')) {
        const answer= 'Bạn đã làm trắc nghiệm khảo sát để xem mình thuộc lĩnh vực phù hợp nào chưa? Nếu bạn có chuyên ngành mình yêu thích rồi thì hãy cho tớ biết nhé!';
        animateBotResponse(answer)
        setStage('courseConsultation');
      } else if (lowerInput.includes('giá')) {
        const answer= 'Vui lòng cho tôi biết lĩnh vực và khoảng giá mà bạn quan tâm (ví dụ: lĩnh vực Nghệ Thuật từ 2000000 đến 5000000 ).';
        animateBotResponse(answer)
        setStage('awaitingPriceInfo');
      } else if (lowerInput.includes('nhanh')) {
        const answer= 'Bạn là học sinh hay sinh viên bạn có đam mê hay có ước mơ gì trong tương lai hay không?.';
        animateBotResponse(answer)
        setStage('quickConsultation');
      } else if (lowerInput.includes('đề xuất')) {
        handleCourseRecommendation();
      } else if (lowerInput.includes('cảm ơn')||lowerInput.includes('thanks')) {
          handleEnding();
      } else {
        const answer= 'Xin lỗi, bạn có thể nhập lại được không';
        animateBotResponse(answer)
      }
    }
    else {
      const errorMessage = { sender: 'bot', text: 'Đã xảy ra lỗi nhập liệu' };
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
        const answer1= 'Bạn hãy nhấn vào link dưới đây để làm thử bài test nhằm hiểu rõ hơn về lĩnh vực phù hợp nhé! ';
        animateBotResponse(answer1)
        
        setMessages(prev => [...prev, { sender: 'bot', text: <div className='linkServey'> <span role="gridcell"><a className='link-servey' href="http://localhost:5173/servey" target="_blank" rel="link">http://localhost:5173/servey</a></span>
        animateBotResponse(answer)
        </div> }]);
        const answer2= 'Giờ bạn hãy nhập vào khóa học mà hệ thống đã đề xuất nhé!';
        animateBotResponse(answer2)
        
        setAwaitingCourseName(true);
        
      } 
      else if (lowerInput.includes('rồi') || lowerInput.includes('xong')|| lowerInput.includes('mới')) {
        const answer= 'Bạn thuộc lĩnh vực nào nhỉ? Vui lòng nhập tên khóa học bạn quan tâm.';
        animateBotResponse(answer)  
          
          // Đặt biến cờ để chờ người dùng nhập tên khóa học
          setAwaitingCourseName(true);
      } 
      else if (awaitingCourseName) {
          await sendMessageToBot(input);
          // setAwaitingCourseName(false);
        } 
      else {
        const answer= 'Xin lỗi, bạn đã làm bài test chưa? Hãy trả lời "chưa" hoặc "rồi" để tớ hỗ trợ bạn nhé!';
        animateBotResponse(answer)  
      }
  };

  const handleInputFields = async (input) => {
    try {
      const fieldName = input.toLowerCase().trim(); // Chuyển input sang chữ thường và loại bỏ khoảng trắng thừa
      const response = await axios.get('http://localhost:5000/chatbot/getfield');
      const dataField = response.data.Fields; // Giả sử `Fields` là mảng chứa tên lĩnh vực trong dữ liệu trả về
      let matchedField = null; // Khởi tạo biến để lưu trữ kết quả nếu tìm thấy
      for (let field of dataField) {
        // Kiểm tra xem fieldName có chứa tên field không
        if (fieldName.includes(field.field_name.toLowerCase())) {
            matchedField = field;
        }
      }
    return matchedField.field_name
    }
    catch{
      console.log("error");
      
    }
  }

  const sendMessageToBot = async (input) => {
    try {

        // Call the API with the user's input
        const fieldName = await handleInputFields(input);
        const response = await axios.post('http://localhost:5000/chatbot/GetCourse', {
          fieldName: fieldName,
        });
        // Check if the response contains a courses array
        if (response.data.courses && response.data.courses.length > 0) {
            const matchedCourse = response.data.courses;            
            if (matchedCourse) {
              const defaultFormatCourseText = (course) => {
                return (
                  <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                    <h1>Khóa học:{course.course_name}</h1>
                    <h1>Lĩnh vực: {course.field_name}</h1>
                    <h1>Mô tả: {course.course_short_description}</h1>
                    <h1>Giá: {course.course_price}VNĐ </h1>
                    </Link>
                  </div>);
              };
              displayCourses(matchedCourse,defaultFormatCourseText);
            }
            
            else {
                console.log('Không tìm thấy khóa học phù hợp với tên đã nhập.');
                const answer= 'Không tìm thấy khóa học phù hợp với tên đã nhập.';
                animateBotResponse(answer)
            }
          

        } 
        else {
            console.log(response.data.message || 'Không có khóa học nào.');
            const answer = 'Xin lỗi tôi không tìm thấy khóa học như trên. Bạn có thể thử lại được không?';
            animateBotResponse(answer)  

        }
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        const answer= 'Có lỗi xảy ra khi kết nối với hệ thống.';
        animateBotResponse(answer)
    }
};

  // Xử lý giá cả khóa học
  const handleAwaitingPriceInfo = async (input) => {
    // Tìm khoảng giá từ input và chuyển đổi sang dạng số
    const prices = input.match(/\d+/g)?.map(Number);
    const [lowPrice, highPrice] = prices.sort((a, b) => a - b); // Sắp xếp từ nhỏ đến lớn
        const matchedField = await handleInputFields(input);
        if (matchedField) {
          if (prices && prices.length == 2) {
            try {
              const response = await axios.post('http://localhost:5000/chatbot/PrizeRange', {
                fieldName: matchedField,
                minPrize: lowPrice,
                maxPrize: highPrice
              });
              const matchedCourses = response.data.courses;
              if (matchedCourses && matchedCourses.length >0) {
                if (matchedCourses) {
                  const defaultFormatCourseText = (course) => {
                    return (
                      <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}VNĐ </h1>
                        </Link>
                      </div>);
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                }
                else {
                  const answer= 'Xin lỗi, khóa học ${matchedField}';
                  animateBotResponse(answer)
                }
              }
              else {
                const answer= 'Xin lỗi, không tìm thấy khóa học nào phù hợp với mức giá trên! vui lòng thử lại.';
                animateBotResponse(answer)
              }
            }
             catch (error) {
              console.error('Error fetching courses by price range:', error);
              const answer= 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.';
              animateBotResponse(answer)
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
                      <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}VNĐ </h1>
                        </Link>
                      </div>
                    );
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                } else {
                  const answer= 'Xin lỗi, không tìm thấy khóa học nào phù hợp với mức giá trên! vui lòng thử lại';
                  animateBotResponse(answer)
                }
              } 
              catch (error) {
                console.error('Error fetching courses by price:', error);
                const answer= 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.';
                animateBotResponse(answer)
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
                      <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}VNĐ </h1>
                        </Link>
                      </div>);
                  }
                  displayCourses(matchedCourses,defaultFormatCourseText);
                } else {
                  const answer= 'Xin lỗi, không tìm thấy khóa học nào phù hợp trên ';
                  animateBotResponse(answer)
                }
              } 
              catch (error) {
                console.error('Error fetching courses by price:', error);
                const answer= 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.';
                animateBotResponse(answer)
              }
            }     
          }
          else {
            const answer= 'Vui lòng cung cấp khoảng giá rõ ràng hơn để tôi có thể tìm khóa học phù hợp.';
            animateBotResponse(answer)
            setStage('awaitingPriceInfo');
          }
        }
        else{
          try {
            // Gửi yêu cầu POST với minPrize và maxPrize tới API /Prize 
            const response = await axios.post('http://localhost:5000/chatbot/PrizeOnly', {
            maxPrize:highPrice,
            minPrize:lowPrice
            });
            const matchedCourses = response.data.courses;
            console.log('matchedCourses:', matchedCourses);
            
            if (matchedCourses.length > 0) {
            const answer= 'Tôi không tìm thấy thông tin khóa học nào phù hợp nhưng dưới đây là gợi ý một số khóa học đáp ứng khoảng giá mà bạn chọn';
            animateBotResponse(answer)
              const defaultFormatCourseText = (course) => {
                return (
                  <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                        <h1>Khóa học: {course.course_name}</h1>
                        <h1>Mô tả: {course.course_short_description}</h1>
                        <h1>Giá: {course.course_price}VNĐ </h1>
                        </Link>
                      </div>);
              }
              displayCourses(matchedCourses,defaultFormatCourseText);
            } else {
              const answer= 'Xin lỗi, không tìm thấy khóa học nào phù hợp trên ';
              animateBotResponse(answer)
            }
          } 
          catch (error) {
            console.error('Error fetching courses by price:', error);
            const answer= 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.';
            animateBotResponse(answer)
          }
        }
  };

  // Đề xuất khóa học
  const handleCourseRecommendation = async () => {
    try {
      const response = await axios.get('http://localhost:5000/chatbot/Recomment');
      const matchedCourses = response.data.courses;
    
          if (matchedCourses) {
            const answer= 'Dưới đây là gợi ý một số khóa học có nhiều người đăng kí nhất';
            animateBotResponse(answer)
            const defaultFormatCourseText = (course) => {
              return (
                <div className='courseChat'> <Link to={`/course/${course.course_id}`} className="course-link">
                  <h1>Khóa học: {course.course_name}</h1>
                  <h1>Mô tả: {course.course_short_description}</h1>
                  <h1>Giá: {course.course_price}$ </h1>
                  <h1>Thời Lượng: {course.course_duration} </h1>
                  <h1>Số Thành Viên: {course.enrollment_count}  </h1>
                  </Link>
                </div>);
            }
            displayCourses(matchedCourses,defaultFormatCourseText);
          } else {
            const answer= 'Không tìm thấy khóa học';
            animateBotResponse(answer)
          }
    } catch (error) {
      console.error('Error fetching courses:', error);
      const answer= 'Đã xảy ra lỗi khi lấy thông tin khóa học. Vui lòng thử lại sau.';
      animateBotResponse(answer)
    }
  };

  const TypingIndicator = () => (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
  
  const handleQuickConsultation = async (input) => {
    const lowerInput = input.toLowerCase().trim();
  
    const isFarewell = (text) => {
      const farewellKeywords = ['thanks', 'ok', 'bye', 'good bye', 'cảm ơn'];
      return farewellKeywords.some((keyword) => text.includes(keyword));
    };
  
    if (isFarewell(lowerInput)) {
      changeStage();
    } else {
      try {
        // Hiển thị trạng thái typing của bot
        setMessages((prev) => [...prev, { sender: 'bot', text: '...', typing: true }]);
  
        // Gửi yêu cầu đến API
        const response = await axios.post('http://localhost:5000/utl/chat', {
          message: input,
        });
  
        // Lấy phản hồi từ API hoặc hiển thị thông báo mặc định
        const answer = response.data?.response || 'Không tìm thấy câu trả lời phù hợp.';
  
        // Xóa trạng thái typing và thêm câu trả lời của bot
        setMessages((prev) => prev.filter((msg) => !msg.typing));
        setMessages((prev) => [...prev, { sender: 'bot', text: answer }]);
        
        // Gọi hàm hiển thị hiệu ứng trả lời của bot
        animateBotResponse(answer);
      } catch (error) {
        console.error('Error fetching data from API:', error);
  
        // Xử lý lỗi và hiển thị thông báo phù hợp
        let errorMessage = 'Đã xảy ra lỗi khi gọi API. Vui lòng thử lại sau.';
        if (error.response) {
          errorMessage = `Lỗi từ server: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'Không thể kết nối tới API. Vui lòng kiểm tra kết nối.';
        }
  
        // Xóa trạng thái typing và hiển thị lỗi
        setMessages((prev) => prev.filter((msg) => !msg.typing));
        setMessages((prev) => [...prev, { sender: 'bot', text: errorMessage }]);
        changeStage();
      }
    }
  };
  
  
  
  const animateBotResponse = (text) => {
    let currentText = '';
  
    // Thêm tin nhắn rỗng cho bot trước khi bắt đầu hiển thị từng chữ
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: '' }, // Tin nhắn rỗng sẽ được cập nhật dần
    ]);
  
    const interval = setInterval(() => {
      if (currentText.length < text.length) {
        currentText += text[currentText.length]; // Lấy ký tự tiếp theo
        setMessages((prev) =>
          prev.map((msg, index) =>
            // Chỉ cập nhật tin nhắn cuối cùng (tin nhắn của bot)
            index === prev.length - 1 ? { ...msg, text: currentText } : msg
          )
        );
      } else {
        clearInterval(interval); // Kết thúc khi hiển thị đủ nội dung
      }
    }, 50);
  };
  
  
  
  
//sinh viên
//Tôi học ngành IT
//Tôi muốn làm lập trình viên
//Robot và tự động hóa


return (
  <>
    {showChatbot && (
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <a href="/">
            <img
              src="../img/Header/Logo.svg"
              alt="Logo"
              className="chatbot-logo"
            />
          </a>
          <button className="chatbot-close-btn" onClick={onClose} aria-label="Close chatbot">
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
              onClick={() => msg.clickable && handleClickOption(msg.text)}
              style={{ cursor: msg.clickable ? "pointer" : "default" }}
            >
              {msg.typing ? <TypingIndicator /> : msg.text} {/* Thêm TypingIndicator */}
            </div>
          ))}
          <div ref={messagesEndRef}></div> {/* Giữ scroll đến cuối */}
        </div>

        {/* Input */}
        <div className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                sendMessage();
              }
            }}
            placeholder="Nhập câu trả lời của bạn tại đây ^^"
            aria-label="Chat input"
          />
          <button onClick={sendMessage} disabled={!input.trim()}>
            Gửi
          </button>
        </div>
      </div>
    )}
  </>
);


}

export default Chatbot;
