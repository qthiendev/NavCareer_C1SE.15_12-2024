const { trySortCoursesByFieldAndPrice } = require('./chatbotGetPrizeRangeService');


const SortCoursesByFieldAndPrice = async(req, res)=> {

  try {
    const {role} = req.session;
    const {fieldName, minPrize, maxPrize} = req.body;
    const result = await trySortCoursesByFieldAndPrice(role,fieldName, minPrize, maxPrize);

    // Phản hồi lại cho chatbot.js
    if (Array.isArray(result)) {
      res.status(200).json({ courses: result });
    } else {
      res.status(200).json({ message: result });
    }
    console.log(result);
    
  } catch (error) {
    console.error('Lỗi trong chatbotController:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.' });
  }
}

module.exports = { SortCoursesByFieldAndPrice };
