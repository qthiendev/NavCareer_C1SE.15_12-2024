use NavCareerDB;

delete from Courses;		 
go

dbcc checkident (AuthProcedureBanned, RESEED, 0);
go

execute CreateCourse 1, N'Lập trình hướng đối tượng C++',  N'Khóa học về lập trình C++ cơ bản và hướng đối tượng với C++.', N'Cách sử dụng một số lớp cơ bản trong thư viện C++', 3000000, N'3 tháng';
execute CreateCourse 1, N'Lập trình Python', N'Khóa học về lập trình Python.', N'Khóa học này giới thiệu các nguyên tắc lập trình cơ bản và nâng cao thông qua ngôn ngữ Python.', 2000000, N'5 tháng';
execute CreateCourse 1, N'Kỹ thuật Cơ khí', N'Giới thiệu về cơ khí', N'Khóa học bao gồm các nguyên lý cơ bản về cơ khí và ứng dụng', 500, N'30 Giờ';
execute CreateCourse 1, N'Kỹ thuật Điện', N'Nhập môn kỹ thuật điện', N'Khóa học cung cấp kiến thức cơ bản về kỹ thuật điện và ứng dụng thực tiễn', 450, N'28 Giờ';
execute CreateCourse 1, N'Kỹ thuật Ô tô', N'Giới thiệu về kỹ thuật ô tô', N'Tìm hiểu về cấu tạo và nguyên lý hoạt động của ô tô', 550, N'35 Giờ';
execute CreateCourse 1, N'Kỹ thuật Hóa học', N'Cơ bản về kỹ thuật hóa học', N'Khóa học cung cấp kiến thức nền tảng về kỹ thuật hóa học', 600, N'32 Giờ';
execute CreateCourse 1, N'Kỹ thuật Điện tử', N'Nhập môn kỹ thuật điện tử', N'Khóa học này sẽ giới thiệu về các mạch điện tử và ứng dụng', 480, N'30 Giờ';
execute CreateCourse 1, N'Nghiên cứu Xã hội học', N'Cơ bản về xã hội học', N'Tìm hiểu về cấu trúc và hành vi xã hội', 400, N'25 Giờ';
execute CreateCourse 1, N'Nghiên cứu Kinh tế học', N'Giới thiệu về kinh tế học', N'Khóa học cung cấp kiến thức nền tảng về kinh tế học và các nguyên tắc cơ bản', 500, N'30 Giờ';
execute CreateCourse 1, N'Nghiên cứu Lịch sử', N'Tìm hiểu lịch sử thế giới', N'Khóa học cung cấp cái nhìn tổng quan về các sự kiện lịch sử quan trọng', 350, N'20 Giờ';
execute CreateCourse 1, N'Nghiên cứu Văn hóa', N'Khám phá văn hóa thế giới', N'Giới thiệu về các nền văn hóa và sự đa dạng văn hóa', 450, N'28 Giờ';
execute CreateCourse 1, N'Nghiên cứu Chính trị', N'Nhập môn khoa học chính trị', N'Khóa học này sẽ giới thiệu về các hệ thống chính trị và tư tưởng chính trị', 400, N'25 Giờ';
execute CreateCourse 1, N'Hội họa cơ bản', N'Khóa học về hội họa', N'Tìm hiểu các kỹ thuật hội họa cơ bản', 300, N'20 Giờ';
execute CreateCourse 1, N'Nhạc lý cơ bản', N'Giới thiệu về nhạc lý', N'Khóa học cung cấp kiến thức nhạc lý cơ bản', 320, N'18 Giờ';
execute CreateCourse 1, N'Nhiếp ảnh', N'Khám phá nhiếp ảnh', N'Tìm hiểu các kỹ thuật nhiếp ảnh và bố cục hình ảnh', 350, N'22 Giờ';
execute CreateCourse 1, N'Điêu khắc', N'Giới thiệu về điêu khắc', N'Khóa học bao gồm các kỹ thuật và lịch sử điêu khắc', 380, N'25 Giờ';
execute CreateCourse 1, N'Vẽ kỹ thuật số', N'Thế giới của vẽ kỹ thuật số', N'Khóa học này giúp bạn tìm hiểu về vẽ kỹ thuật số và công cụ hỗ trợ', 400, N'30 Giờ';
execute CreateCourse 1, N'Tâm lý học cơ bản', N'Nhập môn tâm lý học', N'Tìm hiểu về các khái niệm và lý thuyết tâm lý học', 420, N'27 Giờ';
execute CreateCourse 1, N'Xã hội học', N'Khám phá xã hội học', N'Giới thiệu về các nguyên lý xã hội học và hành vi xã hội', 390, N'24 Giờ';
execute CreateCourse 1, N'Tư vấn xã hội', N'Cơ bản về tư vấn xã hội', N'Khóa học này giúp phát triển kỹ năng tư vấn trong lĩnh vực xã hội', 370, N'22 Giờ';
execute CreateCourse 1, N'Công tác xã hội', N'Nhập môn công tác xã hội', N'Tìm hiểu các kỹ năng và nguyên lý trong công tác xã hội', 400, N'26 Giờ';
execute CreateCourse 1, N'Quan hệ quốc tế', N'Tìm hiểu quan hệ quốc tế', N'Khóa học cung cấp cái nhìn tổng quan về quan hệ quốc tế và ngoại giao', 450, N'30 Giờ';
execute CreateCourse 1, N'Quản lý dự án', N'Nhập môn quản lý dự án', N'Tìm hiểu các bước và kỹ thuật quản lý dự án hiệu quả', 600, N'40 Giờ';
execute CreateCourse 1, N'Quản trị doanh nghiệp', N'Cơ bản về quản trị doanh nghiệp', N'Khóa học cung cấp kiến thức quản trị doanh nghiệp', 550, N'35 Giờ';
execute CreateCourse 1, N'Quản lý nhân sự', N'Giới thiệu về quản lý nhân sự', N'Tìm hiểu các phương pháp và kỹ thuật quản lý nhân sự', 500, N'30 Giờ';
execute CreateCourse 1, N'Quản lý tài chính', N'Khám phá tài chính doanh nghiệp', N'Khóa học bao gồm các kiến thức cơ bản về tài chính doanh nghiệp', 620, N'42 Giờ';
execute CreateCourse 1, N'Quản lý chuỗi cung ứng', N'Nhập môn quản lý chuỗi cung ứng', N'Khóa học cung cấp kiến thức về chuỗi cung ứng và logistic', 590, N'38 Giờ';
execute CreateCourse 1, N'Kế toán cơ bản', N'Nhập môn kế toán', N'Khóa học cung cấp kiến thức kế toán cơ bản', 450, N'30 Giờ';
execute CreateCourse 1, N'Phân tích tài chính', N'Giới thiệu phân tích tài chính', N'Tìm hiểu cách phân tích tài chính và báo cáo', 470, N'32 Giờ';
execute CreateCourse 1, N'Kiểm toán', N'Cơ bản về kiểm toán', N'Khóa học cung cấp kiến thức cơ bản về kiểm toán', 500, N'34 Giờ';
execute CreateCourse 1, N'Tài chính ngân hàng', N'Nhập môn tài chính ngân hàng', N'Tìm hiểu về hoạt động tài chính ngân hàng', 550, N'36 Giờ';
execute CreateCourse 1, N'Quản lý rủi ro', N'Khám phá quản lý rủi ro', N'Khóa học cung cấp kiến thức về quản lý và kiểm soát rủi ro', 600, N'40 Giờ';