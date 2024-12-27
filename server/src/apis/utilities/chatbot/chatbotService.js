const { spawn } = require("child_process");
const path = require('path');

const tryChat = (sentence) => {
    return new Promise((resolve, reject) => {
        // Sử dụng đường dẫn tuyệt đối mà không cần path.join
        
        const pythonScriptPath = 'E:/zyear4/clone/NavCareer_C1SE.15_12-2024/chatbot/run.py';
        
        // Kiểm tra đường dẫn
        console.log("Python Script Path:", pythonScriptPath);
        
        const pythonProcess = spawn("python", [pythonScriptPath, sentence]);

        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (error) => {
            reject(error.toString());
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                try {
                    const parsedResult = JSON.parse(result); // Parse JSON từ Python
                    resolve(parsedResult.tag); // Lấy tag từ kết quả
                } catch (err) {
                    reject("Error parsing result: " + err);
                }
            } else {
                reject("Python script exited with code " + code);
            }
        });
    });
};

module.exports = { tryChat };
