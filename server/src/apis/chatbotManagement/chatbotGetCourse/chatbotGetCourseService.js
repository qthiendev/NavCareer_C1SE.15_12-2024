const ncbd = require('../../databases/ncdbService');

const tryGetCourse = async (role) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(role, 'exec GetAllCourses');

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi lấy khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi tìm kiếm khóa học.');
  }
};


module.exports = { tryGetCourse };
