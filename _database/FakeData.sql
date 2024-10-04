insert into NavQuestions ([question_id], [question_description])
values
(0, N'Bạn đánh giá thế nào về khả năng viết văn/ làm thơ của mình?'),
(1, N'Bạn đánh giá thế nào về khả năng học một ngôn ngữ mới của mình?'),
(2, N'Bạn thấy khả năng đọc và làm việc với giấy tờ, văn bản, tài liệu của mình như thế nào?'),
(3, N'Hãy đánh giá khả năng dùng lời nói để truyền đạt đến mọi người (Thuyết trình, hướng dẫn, giải thích,...)?');
use master
insert into NavAnswers ([answer_id], [answer_description], [question_id])
values
(0, N'Rất thấp', 0),
(1, N'Thấp', 0),
(2, N'Cao', 0),
(3, N'Rất cao', 0),
(4, N'Rất thấp', 1),
(5, N'Thấp', 1),
(6, N'Cao', 1),
(7, N'Rất cao', 1),
(8, N'Rất thấp', 2),
(9, N'Thấp', 2),
(10, N'Cao', 2),
(11, N'Rất cao', 2),
(12, N'Rất thấp', 3),
(13, N'Thấp', 3),
(14, N'Cao', 3),
(15, N'Rất cao', 3);

insert into Authentications ([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
values
(0, 'admin', 'admin', 'admin@gmail.com', getdate(), 0),
(1, 'esp', 'esp', 'esp@gmail.com', getdate(), 1),
(2, 'student', 'student', 'student@gmail.com', getdate(), 2),
(3, 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', getdate(), 0);

insert into Authentications ([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
values
(0, 'admin', 'admin', 'admin@gmail.com', getdate(), 0),
(1, 'esp', 'esp', 'esp@gmail.com', getdate(), 1),
(2, 'student', 'student', 'student@gmail.com', getdate(), 2),
(3, 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', getdate(), 0);

insert into Users ([user_id], [user_name], [email], [birthdate], [gender], [phone_number], [address], [date_joined], [resource_url], [authentication_id])
values
(0, N'admin 0', N'admin@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'/profiles/_0', 0),
(1, N'education service provider 0', N'esp@gmail.com', getdate(), 0, N'0123456789', N'Đà Nẵng', getdate(), N'/profiles/_1', 1),
(2, N'student 0', N'student@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'/profiles/_2', 2),
(3, N'Trịnh Quý Thiện', N'trinhquythien.dev@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'/profiles/_3', 3);
go

insert into SystemFeedbacks ([feedback_id], [feedback_description], [feedback_date], [user_id])
values
(0, N'Need more course', getdate(), 2);
go

insert into Courses ([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
values
(0, N'Lập trình C/C++', N'Khóa học về lập trình C cơ bản và hướng đối tượng với C++.', N'3 tháng', getdate(), 1),
(1, N'Lập trình Python', N'Khóa học về lập trình Python.', N'5 tháng', getdate(), 1);
go

insert into Modules ([module_id], [module_name], [created_date], [module_ordinal], [course_id])
values
(0, N'Lập trình C cơ bản.', getdate(), 0, 0),
(1, N'Hướng đối tượng và lập trình C++.', getdate(), 0, 0),
(2, N'Lập trình Python cơ bản.', getdate(), 0, 1),
(3, N'Tự động hóa với Python.', getdate(), 1, 1);
go

insert into CollectionTypes ([collection_type_id], [collection_type_name])
values
(0, 'Lesson'),
(1, 'Quiz'),
(2, 'Graded Quiz');

insert into Collections ([collection_id], [collection_name], [created_date], [collection_ordinal], [collection_type_id], [module_id])
values
(0, N'Khái niệm lập trình.', getdate(), 0, 0, 0),
(1, N'Biến và hằng trong C.', getdate(), 1, 0, 0),
(2, N'Input và output.', getdate(), 2, 0, 0),
(3, N'Kiểm tra.', getdate(), 3, 2, 0),

(4, N'Khái niệm hướng đối tượng.', getdate(), 0, 0, 1),
(5, N'Lớp và đối tượng.', getdate(), 1, 0, 1),
(6, N'Con trỏ.', getdate(), 2, 0, 1),
(7, N'Kiểm tra.', getdate(), 3, 2, 1),

(8, N'Khái niệm lập trình.', getdate(), 0, 0, 2),
(9, N'Biến và hằng trong Python.', getdate(), 1, 0, 2),
(10, N'Kiểm tra nhanh.', getdate(), 2, 1, 2),
(11, N'Input và output.', getdate(), 3, 0, 2),
(12, N'Kiểm tra.', getdate(), 4, 2, 2),

(13, N'Khái niệm tự động hóa tác vụ.', getdate(), 0, 0, 3),
(14, N'Đọc và xử lý file.', getdate(), 1, 0, 3),
(15, N'Kiểm tra nhanh.', getdate(), 2, 1, 3),
(16, N'Sử dụng máy ảo.', getdate(), 3, 0, 3),
(17, N'Kiểm tra.', getdate(), 4, 2, 3);

insert into QuestionTypes ([question_type_id], [type_description])
values
(0, N'Multiple choice'),
(1, N'Multiple response');

insert into Questions ([question_id], [question_description], [question_type_id])
values
(0, N'Câu lệnh nào dùng để in ra màn hình trong C?', 0),
(1, N'Những thành phần nào dưới đây là kiểu dữ liệu trong C?', 1);
go
insert into Answers ([answer_id], [answer_description], [is_right], [question_id])
values
(0, N'printf()', 1, 0),
(1, N'scanf()', 0, 0),
(2, N'cout', 0, 0),
(3, N'echo', 0, 0),

(4, N'int', 1, 1),
(5, N'float', 1, 1),
(6, N'string', 1, 1),
(7, N'object', 0, 1);
go
insert into MaterialType ([material_type_id], [material_type_name])
values
(0, 'Text'),
(1, 'Image'),
(2, 'Video'),
(3, 'Question');
go
insert into Materials ([material_id], [material_content], [material_ordinal], [material_type_id], [collection_id])
values
(0, N'Giới thiệu về lập trình C', 0, 0, 0),
(1, N'course/_0/lap_trinh_c.png', 1, 1, 0),
(2, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 0),
(3, N'course/_0/lap_trinh_c.mp4', 3, 2, 0),

(4, N'Biến và hằng trong C.', 0, 0, 1),
(5, N'course/_0/lap_trinh_c.png', 1, 1, 1),
(6, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 1),
(7, N'course/_0/lap_trinh_c.mp4', 3, 2, 1),

(8, N'Input và output.', 0, 0, 2),
(9, N'course/_0/lap_trinh_c.png', 1, 1, 2),
(10, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 2),
(11, N'course/_0/lap_trinh_c.mp4', 3, 2, 2),

(12, N'0', 0, 3, 3),
(13, N'1', 1, 3, 3);
go
insert into Enrollments([enrollment_id], [enrollment_date], [is_done], [student_id], [course_id])
values
(0, getdate(), 1, 2, 0),
(1, getdate(), 0, 2, 1);
go
insert into Tracking ([tracking_id], [enrollment_id], [collection_id])
values
(0, 0, 0),
(1, 0, 1),
(2, 0, 2),
(3, 0, 3),
(4, 1, 4);
go
insert into Grades([grade_id], [grade_number], [graded_date], [enrollment_id], [module_id])
values
(0, 95, getdate(), 0, 0),
(1, 85, getdate(), 0, 1);
go
insert Accomplishments ([accomplishment_id], [completion_date], [overall_grade], [certificate_id], [enrollment_id])
values
(0, getdate(), 90, N'BCCPP010', 0);
go
insert into CourseFeedbacks ([feedback_id], [feedback_description], [feedback_date], [enrollment_id])
values
(0, N'Cảm ơn!', getdate(), 0);
go
insert into Fields ([field_id], [field_description])
values
(0, N'Programming'),
(1, N'C'),
(2, N'C++'),
(3, N'Python'),
(4, N'Automation'),
(5, N'Object-oriented'),
(6, N'Virtual machine');
go
insert into CourseField ([course_field_id], [course_id], [field_id])
values
(0, 0, 0),
(1, 0, 1),
(2, 0, 2),
(3, 0, 5),
(4, 1, 0),
(5, 1, 3),
(6, 0, 4),
(7, 0, 5),
(8, 0, 6);
go
