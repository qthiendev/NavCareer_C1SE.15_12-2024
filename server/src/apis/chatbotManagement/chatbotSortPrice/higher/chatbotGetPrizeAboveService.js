const ncbd = require('../../../databases/ncdbService');

const tryGetPrizeAbove = async (role, minPrize) => {
  try {
    const dataCourse = await ncbd.query(role, 'exec GetCoursesAbovePrice @minPrize',{minPrize} );
    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lọc khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi lọc khóa học.');
  }
};


module.exports = { tryGetPrizeAbove };
