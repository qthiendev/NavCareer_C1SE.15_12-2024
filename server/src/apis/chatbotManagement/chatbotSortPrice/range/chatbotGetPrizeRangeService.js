const ncbd = require('../../../databases/ncdbService');

const tryGetPrizeRange = async (role, minPrize, maxPrize) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(role, 'exec GetCoursesByPriceRange @minPrize , @maxPrize', {minPrize, maxPrize} );

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lọc khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi lọc khóa học.');
  }
};


module.exports = { tryGetPrizeRange };
