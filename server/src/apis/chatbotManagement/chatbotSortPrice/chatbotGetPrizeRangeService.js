const ncbd = require('../../databases/ncdbService');
const trySortCoursesByFieldAndPrice = async (role, fieldName, min_price, max_price) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(
      role, 
      'exec SortCoursesByFieldAndPrice @fieldName, @min_price, @max_price', 
      { fieldName, min_price, max_price }  // Đổi tên tham số cho phù hợp với SQL
    );

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lọc khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi lọc khóa học.');
  }
};



module.exports = { trySortCoursesByFieldAndPrice };
 
