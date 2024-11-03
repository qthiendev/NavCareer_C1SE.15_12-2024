const ncbd = require('../../databases/ncdbService');

const tryGetField = async (role) => {
  try {
    // Gọi truy vấn để lấy tất cả khóa học từ database
    const dataField = await ncbd.query(role, 'exec getField');

    return dataField;
  } catch (error) {
    console.error('Lỗi khi lấy tên lĩnh vực:', error);
    throw new Error('Đã xảy ra lỗi khi tìm kiếm khóa học.');
  }
};


module.exports = { tryGetField };
