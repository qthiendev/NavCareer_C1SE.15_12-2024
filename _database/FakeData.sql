delete from CourseField;
delete from Fields;
delete from CourseFeedbacks;
delete from Accomplishments;
delete from Grades;
delete from UserTracking;
delete from Enrollments;
delete from Materials;
delete from MaterialType;
delete from Answers;
delete from Questions;
delete from QuestionTypes;
delete from Collections;
delete from CollectionTypes;
delete from Modules;
delete from Courses;
delete from SystemFeedbacks;
delete from UserProcedureBanned;
delete from Users;
delete from Authentications;
delete from Authorizations;
delete from NavAnswers;
delete from NavQuestions;

use NavCareerDB;
--Insert data
execute CreateNavQuestion N'Bạn đánh giá thế nào về khả năng viết văn/ làm thơ của mình?';
execute CreateNavQuestion N'Bạn đánh giá thế nào về khả năng học một ngôn ngữ mới của mình?';
execute CreateNavQuestion N'Bạn thấy khả năng đọc và làm việc với giấy tờ, văn bản, tài liệu của mình như thế nào?';
execute CreateNavQuestion N'Hãy đánh giá khả năng dùng lời nói để truyền đạt đến mọi người (Thuyết trình, hướng dẫn, giải thích,...)?';

execute CreateNavAnswer N'Rất thấp', 0;
execute CreateNavAnswer N'Thấp', 0;
execute CreateNavAnswer N'Cao', 0;
execute CreateNavAnswer N'Rất cao', 0;
execute CreateNavAnswer N'Rất thấp', 1;
execute CreateNavAnswer N'Thấp', 1;
execute CreateNavAnswer N'Cao', 1;
execute CreateNavAnswer N'Rất cao', 1;
execute CreateNavAnswer N'Rất thấp', 2;
execute CreateNavAnswer N'Thấp', 2;
execute CreateNavAnswer N'Cao', 2;
execute CreateNavAnswer N'Rất cao', 2;
execute CreateNavAnswer N'Rất thấp', 3;
execute CreateNavAnswer N'Thấp', 3;
execute CreateNavAnswer N'Cao', 3;
execute CreateNavAnswer N'Rất cao', 3;

execute CreateAuthorization 0, 'NAV_GUEST', 'qT7i2W8pLk9eX3nZvC4dF5oG1rJ6yH9';
execute CreateAuthorization 0, 'NAV_ADMIN', 'Uj6wV9pLm2Nz8RtY5bX3oF1KvQ4sM7n';
execute CreateAuthorization 0, 'NAV_ESP', 'Pz5wK2yL8Qm3vR1Xt6fJ9nTgC4hS7uA';
execute CreateAuthorization 0, 'NAV_STUDENT', 'mG4tR1qL7yU9fJ2dZ5nX8cHwP6kV3oB';

execute CreateAuthentication 'nav_admin', 'nav_admin', 'nav_admin@gmail.com', 1, 1;
execute CreateAuthentication 'nav_esp', 'nav_esp', 'nav_esp@gmail.com', 2, 1;
execute CreateAuthentication 'nav_student', 'nav_student', 'nav_student@gmail.com', 3, 1;
execute CreateAuthentication 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', 1, 1;

execute CreateUser 0, N'nav_admin 0', N'1980-01-01', 1, N'nav_admin@gmail.com', N'0123456789', N'Đà Nẵng', 0;
execute CreateUser 0, N'education service provider 0', N'1985-01-01', 0, N'nav_esp@gmail.com', N'0123456789', N'Đà Nẵng', 1;
execute CreateUser 0, N'nav_student 0', N'1990-01-01', 1, N'nav_student@gmail.com', N'0123456789', N'Đà Nẵng', 2;
execute CreateUser 0, N'Trịnh Quý Thiện', N'2003-12-16', 1, N'trinhquythien.dev@gmail.com', N'0123456789', N'Đà Nẵng', 3;

execute CreateSystemFeedback 0,N'Need more course', 2;

execute CreateCourse 0, N'Lập trình C/C++', N'Khóa học về lập trình C cơ bản và hướng đối tượng với C++.', N'3 tháng', 1;
execute CreateCourse 0, N'Lập trình Python', N'Khóa học về lập trình Python.', N'5 tháng', 1;

execute CreateModule 0, N'Lập trình C cơ bản.', 0, 0;
execute CreateModule 0, N'Hướng đối tượng và lập trình C++.', 0, 0;
execute CreateModule 0, N'Lập trình Python cơ bản.', 0, 1;
execute CreateModule 0, N'Tự động hóa với Python.', 1, 1;

execute CreateCollectionType 0, N'Lesson';
execute CreateCollectionType 0, N'Quiz';
execute CreateCollectionType 0, N'Graded Quiz';

execute CreateCollection 0, N'Khái niệm lập trình.', 0, 0, 0;
execute CreateCollection 0, N'Biến và hằng trong C.', 1, 0, 0;
execute CreateCollection 0, N'Input và output.', 2, 0, 0;
execute CreateCollection 0, N'Kiểm tra.', 3, 2, 0;

execute CreateCollection 0, N'Khái niệm hướng đối tượng.', 0, 0, 1;
execute CreateCollection 0, N'Lớp và đối tượng.', 1, 0, 1;
execute CreateCollection 0 ,N'Con trỏ.', 2, 0, 1;
execute CreateCollection 0, N'Kiểm tra.', 3, 2, 1;

execute CreateCollection 0, N'Khái niệm lập trình.', 0, 0, 2;
execute CreateCollection 0, N'Biến và hằng trong Python.', 1, 0, 2;
execute CreateCollection 0, N'Kiểm tra nhanh.', 2, 1, 2;
execute CreateCollection 0, N'Input và output.', 3, 0, 2;
execute CreateCollection 0, N'Kiểm tra.', 4, 2, 2;

execute CreateCollection 0, N'Khái niệm tự động hóa tác vụ.', 0, 0, 3;
execute CreateCollection 0, N'Đọc và xử lý file.', 1, 0, 3;
execute CreateCollection 0, N'Kiểm tra nhanh.', 2, 1, 3;
execute CreateCollection 0, N'Sử dụng máy ảo.', 3, 0, 3;
execute CreateCollection 0, N'Kiểm tra.', 4, 2, 3;

execute CreateQuestionType 0, N'Multiple choice'
execute CreateQuestionType 0, N'Multiple rnav_esponse';

execute CreateQuestion 0, N'Câu lệnh nào dùng để in ra màn hình trong C?', 0;
execute CreateQuestion 0, N'Những thành phần nào dưới đây là kiểu dữ liệu trong C?', 1;

execute CreateAnswer 0, N'printf()', 1, 0;
execute CreateAnswer 0, N'scanf()', 0, 0;
execute CreateAnswer 0, N'cout', 0, 0;
execute CreateAnswer 0, N'echo', 0, 0;

execute CreateAnswer 0, N'int', 1, 1;
execute CreateAnswer 0, N'float', 1, 1;
execute CreateAnswer 0, N'string', 1, 1;
execute CreateAnswer 0, N'object', 0, 1;

execute CreateMaterialType 0, 'Text';
execute CreateMaterialType 0, 'Image';
execute CreateMaterialType 0, 'Video';
execute CreateMaterialType 0, 'Question';

execute CreateMaterial 0, N'Giới thiệu về lập trình C', 0, 0, 0;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.png', 1, 1, 0;
execute CreateMaterial 0, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 0;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.mp4', 3, 2, 0;

execute CreateMaterial 0, N'Biến và hằng trong C.', 0, 0, 1;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.png', 1, 1, 1;
execute CreateMaterial 0, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 1;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.mp4', 3, 2, 1;

execute CreateMaterial 0, N'Input và output.', 0, 0, 2;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.png', 1, 1, 2;
execute CreateMaterial 0, N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 2;
execute CreateMaterial 0, N'course/_0/lap_trinh_c.mp4', 3, 2, 2;

execute CreateMaterial 0, N'0', 0, 3, 3;
execute CreateMaterial 0, N'1', 1, 3, 3;
					   
execute CreateEnrollment 0, 2, 0;
execute CreateEnrollment 0, 2, 1;

execute CreateUserTracking 0, 0, 0;
execute CreateUserTracking 0, 0, 1;
execute CreateUserTracking 0, 0, 2;
execute CreateUserTracking 0, 0, 3;
execute CreateUserTracking 0, 1, 4;

execute CreateGrade 0, 95, 0, 0;
execute CreateGrade 0, 85, 0, 1;

execute CreateAccomplishment 0, 90, N'BCCPP010', 0;

execute CreateCourseFeedback 0, N'Cảm ơn!', 0;

execute CreateField 0, N'Programming';
execute CreateField 0, N'C';
execute CreateField 0, N'C++';
execute CreateField 0, N'Python';
execute CreateField 0, N'Automation';
execute CreateField 0, N'Object-oriented';
execute CreateField 0, N'Virtual machine';

execute CreateCourseField 0, 0, 0;
execute CreateCourseField 0, 0, 1;
execute CreateCourseField 0, 0, 2;
execute CreateCourseField 0, 0, 5;
execute CreateCourseField 0, 1, 0;
execute CreateCourseField 0, 1, 3;
execute CreateCourseField 0, 0, 4;
execute CreateCourseField 0, 0, 5;
execute CreateCourseField 0, 0, 6;
