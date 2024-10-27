const ncbd = require('../../databases/ncdbService');

const tryRecommentCourse = async (role) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataCourse = await ncbd.query(role, 'exec selectTop5Course');

    return dataCourse;
  } catch (error) {
    console.error('Lỗi khi đề xuất khóa học:', error);
    throw new Error('Đã xảy ra lỗi khi đề xuất khóa học.');
  }
};


module.exports = { tryRecommentCourse };
