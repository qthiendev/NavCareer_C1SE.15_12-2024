const ncbd = require('../../databases/ncdbService');
const trySortPriceOnly = async (role, min_price, max_price) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(
      role, 
      'exec sortByPrizeOnly  @min_price, @max_price', 
      { min_price, max_price }  // Đổi tên tham số cho phù hợp với SQL
    );

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lọc khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi lọc khóa học.');
  }
};



module.exports = { trySortPriceOnly };
 
