const { spawn } = require('child_process');
const path = require('path');

const chat = async (req, res) => {
    const userMessage = req.body.message;

    // Tạo đường dẫn tuyệt đối đến chatbot.py
    const pythonScriptPath = path.join(__dirname, '../../../../../chatbot/chatbot.py');

    // Kiểm tra đường dẫn tuyệt đối đúng không
    console.log(`Python script path: ${pythonScriptPath}`);

    // Khởi tạo Python script với tham số userMessage
    const pythonProcess = spawn('python -3.11', [pythonScriptPath, userMessage]);

    let responseData = ''; // Biến lưu trữ dữ liệu trả về từ Python

    // Thu thập dữ liệu từ Python script
    pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString(); // Gộp các mảnh dữ liệu trả về
    });

    pythonProcess.stderr.on('data', (error) => {
        console.error(`Error: ${error}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Chatbot failed to respond.' });
        }
    });

    // Khi Python process kết thúc, gửi phản hồi về cho client
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            if (!res.headersSent) {
                res.json({ response: responseData.trim() }); // Trả về kết quả
            }
        } else {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Chatbot failed to respond.' });
            }
        }
    });
};

module.exports = { chat };
