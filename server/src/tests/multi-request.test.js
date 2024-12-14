const axios = require('axios');

const sendRequest = async (index) => {
    const startTime = Date.now();  // Record start time for this request
    try {
        const response = await axios.get('http://localhost:5000/admin');
        const endTime = Date.now();  // Record end time for this request
        const timeTaken = endTime - startTime;  // Calculate time taken for the request
        console.log(`Request ${index} successful: ${response.status} - Time taken: ${timeTaken}ms`);
    } catch (error) {
        const endTime = Date.now();  // Record end time for this failed request
        const timeTaken = endTime - startTime;  // Calculate time taken for the failed request
        console.log(`Request ${index} failed: ${error.message} - Time taken: ${timeTaken}ms`);
    }
};

const sendMultipleRequests = async (numRequests) => {
    const startTime = Date.now();  // Record the start time for all requests
    const promises = [];
    for (let i = 0; i < numRequests; i++) {
        promises.push(sendRequest(i + 1));
    }
    await Promise.all(promises);
    const endTime = Date.now();  // Record the end time after all requests are sent
    const totalTime = endTime - startTime;  // Calculate the total time
    console.log(`All requests sent! Total time taken: ${totalTime}ms`);
};

// Send 10,000 requests
sendMultipleRequests(1000);
