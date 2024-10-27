const ncbd = require('../../../databases/ncdbService');

const tryGetPrizeLower = async (role, maxPrize) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(role, 'exec GetCoursesBelowPrice @maxPrize',{maxPrize} );

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lọc khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi lọc khóa học.');
  }
};


module.exports = { tryGetPrizeLower };
