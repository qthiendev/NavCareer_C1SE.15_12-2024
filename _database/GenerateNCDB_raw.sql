go
USE master;
go
IF EXISTS(SELECT * FROM sys.databases WHERE name = 'NavCareerDB')
BEGIN
	ALTER DATABASE NavCareerDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE NavCareerDB;
END
go
CREATE DATABASE NavCareerDB;
go
USE NavCareerDB;
go
go
-- Questions
if object_id('NavQuestions', 'U') is not null drop table NavQuestions;
create table NavQuestions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null,
);
insert into NavQuestions ([question_id], [question_description])
values
(0, N'Bạn đánh giá thế nào về khả năng viết văn/ làm thơ của mình?'),
(1, N'Bạn đánh giá thế nào về khả năng học một ngôn ngữ mới của mình?'),
(2, N'Bạn thấy khả năng đọc và làm việc với giấy tờ, văn bản, tài liệu của mình như thế nào?'),
(3, N'Hãy đánh giá khả năng dùng lời nói để truyền đạt đến mọi người (Thuyết trình, hướng dẫn, giải thích,...)?');
go

-- Answers
if object_id('NavAnswers', 'U') is not null drop table NavAnswers;
create table NavAnswers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null,
	[question_id] int not null,
    constraint fk_nav_answer_question_id foreign key (question_id) references NavQuestions(question_id),
);
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
go

-- Authorizations - role
if object_id('Authorizations', 'U') is not null drop table Authorizations;
create table Authorizations (
	[authorization_id] int primary key not null,
	[description] nvarchar(100) not null unique,
)
insert into Authorizations ([authorization_id], [description])
values
(0, N'Admin'),
(1, N'Education service provider'),
(2, N'Student');
go

-- Authentications - user private info
if object_id('Authentications', 'U') is not null drop table Authentications;
create table Authentications (
	[authentication_id] int primary key not null,
	[account] nvarchar(50) not null unique,
	[password] nvarchar(18) not null,
	[identifier_email] nvarchar(100) not null unique,
	[created_date] datetime default getdate() not null,
	[authorization_id] int not null,
	constraint fk_authentication_authorization_id foreign key (authorization_id) references Authorizations(authorization_id)
)
insert into Authentications ([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
values
(0, 'admin', 'admin', 'admin@gmail.com', getdate(), 0),
(1, 'esp', 'esp', 'esp@gmail.com', getdate(), 1),
(2, 'student', 'student', 'student@gmail.com', getdate(), 2),
(3, 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', getdate(), 0);
go

-- Users - user public info
if object_id('Users', 'U') is not null drop table Users;
create table Users (
	[user_id] int primary key not null,
	[user_name] nvarchar(max) not null,
	[email] nvarchar(max),
	[birthdate] datetime default getdate(),
	[gender] bit,
	[phone_number] nvarchar(15),
	[address] nvarchar(max),
	[date_joined] datetime default getdate() not null,
	[resource_url] nvarchar(MAX),
	[authentication_id] int,
	constraint fk_user_authentication_id foreign key (authentication_id) references Authentications(authentication_id)
)
insert into Users ([user_id], [user_name], [email], [birthdate], [gender], [phone_number], [address], [date_joined], [resource_url], [authentication_id])
values
(0, N'admin 0', N'admin@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'profiles/_0', 0),
(1, N'education service provider 0', N'esp@gmail.com', getdate(), 0, N'0123456789', N'Đà Nẵng', getdate(), N'profiles/_1', 1),
(2, N'student 0', N'student@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'profiles/_2', 2),
(3, N'Trịnh Quý Thiện', N'trinhquythien.dev@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), N'profiles/_3', 3);
go

-- Feedbacks
if object_id('SystemFeedbacks', 'U') is not null drop table SystemFeedbacks;
CREATE TABLE SystemFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] nvarchar(max) not null,
    [feedback_date] datetime default getdate() not null,
	[user_id] int NOT NULL,
    constraint fk_feedback_user_id foreign key (user_id) references Users(user_id)
);
insert into SystemFeedbacks ([feedback_id], [feedback_description], [feedback_date], [user_id])
values
(0, N'Need more course', getdate(), 2);
go

-- Courses
if object_id('Courses', 'U') is not null drop table Courses;
create table Courses (
    [course_id] int primary key not null,
    [course_name] nvarchar(500) not null unique,
    [course_description] nvarchar(max) not null,
    [duration] nvarchar(50) not null, -- 1 month, 2 months, 3 years,...
    [created_date] datetime default getdate() not null,
	[provider_id] int not null, -- provider -> add trigger that make sure user role is ESP
    constraint fk_course_provider_id foreign key (provider_id) references Users(user_id),
);
insert into Courses ([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
values
(0, N'Lập trình C/C++', N'Khóa học về lập trình C cơ bản và hướng đối tượng với C++.', N'3 tháng', getdate(), 1),
(1, N'Lập trình Python', N'Khóa học về lập trình Python.', N'5 tháng', getdate(), 1);
go

-- Modules - Course's modules
if object_id('Modules', 'U') is not null drop table Modules;
create table Modules (
	[module_id] int primary key not null,
	[module_name] nvarchar(max) not null,
	[created_date] datetime default getdate() not null,
	[module_ordinal] int not null,
	[course_id] int,
	constraint fk_module_course_id foreign key (course_id) references Courses(course_id),
);
insert into Modules ([module_id], [module_name], [created_date], [module_ordinal], [course_id])
values
(0, N'Lập trình C cơ bản.', getdate(), 0, 0),
(1, N'Hướng đối tượng và lập trình C++.', getdate(), 0, 0),
(2, N'Lập trình Python cơ bản.', getdate(), 0, 1),
(3, N'Tự động hóa với Python.', getdate(), 1, 1);
go

-- Collection Types
if object_id('CollectionTypes', 'U') is not null drop table CollectionTypes;
create table CollectionTypes (
	[collection_type_id] int primary key not null,
	[collection_type_name] nvarchar(max) -- Type for page render
);
insert into CollectionTypes ([collection_type_id], [collection_type_name])
values
(0, 'Lesson'),
(1, 'Quiz'),
(2, 'Graded Quiz');
go

-- Collections - Module's Collections
if object_id('Collections', 'U') is not null drop table Collections;
create table Collections (
	[collection_id] int primary key,
	[collection_name] nvarchar(max) not null,
	[created_date] datetime default getdate() not null,
	[collection_ordinal] int not null,
	[collection_type_id] int,
	[module_id] int,
	constraint fk_collection_collection_type_id foreign key (collection_type_id) references CollectionTypes(collection_type_id),
	constraint fk_collection_module_id foreign key (module_id) references Modules(module_id),
);
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
go

-- QuestionTypes - type for sever render
if object_id('QuestionTypes', 'U') is not null drop table QuestionTypes;
create table QuestionTypes (
    [question_type_id] int primary key not null,
    [type_description] nvarchar(max) not null
);
insert into QuestionTypes ([question_type_id], [type_description])
values
(0, N'Multiple choice'),
(1, N'Multiple response');
go

-- Questions
if object_id('Questions', 'U') is not null drop table Questions;
create table Questions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null,
    [question_type_id] int not null,
    constraint fk_question_question_type_id foreign key (question_type_id) references QuestionTypes(question_type_id)
);
insert into Questions ([question_id], [question_description], [question_type_id])
values
(0, N'Câu lệnh nào dùng để in ra màn hình trong C?', 0),
(1, N'Những thành phần nào dưới đây là kiểu dữ liệu trong C?', 1);
go

-- Answers
if object_id('Answers', 'U') is not null drop table Answers;
create table Answers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null,
	[is_right] bit not null,
	[question_id] int not null,
    constraint fk_answer_question_id foreign key (question_id) references Questions(question_id),
);
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

-- Material types
if object_id('MaterialType', 'U') is not null drop table MaterialType;
create table MaterialType (
	[material_type_id] int primary key,
	[material_type_name] nvarchar(max),
)
insert into MaterialType ([material_type_id], [material_type_name])
values
(0, 'Text'),
(1, 'Image'),
(2, 'Video'),
(3, 'Question');
go

-- Materials - Collection's materials
if object_id('Materials', 'U') is not null drop table Materials;
create table Materials (
    [material_id] int primary key not null,
    [material_content] nvarchar(max),
	[material_ordinal] int not null,
    [material_type_id] int not null,
    [collection_id] int not null,
	constraint fk_material_material_type_id foreign key (material_type_id) references MaterialType(material_type_id),
    constraint fk_material_collection_id foreign key (collection_id) references Collections(collection_id),
);
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

-- Enrollments - after student enroll a course
if object_id('Enrollments', 'U') is not null drop table Enrollments;
create table Enrollments (
    [enrollment_id] int primary key not null,
    [enrollment_date] datetime default getdate() not null,
	[is_done] bit default 0 not null,
	[student_id] int not null,
    [course_id] int not null,
    constraint fk_enrollment_student_id foreign key (student_id) references Users(user_id),
    constraint fk_enrollment_course_id foreign key (course_id) references Courses(course_id),
);
insert into Enrollments([enrollment_id], [enrollment_date], [is_done], [student_id], [course_id])
values
(0, getdate(), 1, 2, 0),
(1, getdate(), 0, 2, 1);
go

-- Tracking - enrollment tracking
if object_id('Tracking', 'U') is not null drop table Tracking;
create table Tracking (
	[tracking_id] int primary key not null,
	[enrollment_id] int not null,
	[collection_id] int not null,
	constraint fk_tracking_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id),
	constraint fk_tracking_collection_id foreign key (collection_id) references Collections(collection_id)
);
insert into Tracking ([tracking_id], [enrollment_id], [collection_id])
values
(0, 0, 0),
(1, 0, 1),
(2, 0, 2),
(3, 0, 3),
(4, 1, 4);
go

-- Grade
if object_id('Grades', 'U') is not null drop table Grades;
create table Grades (
	[grade_id] int primary key not null,
	[grade_number] int not null,
	[graded_date] datetime default getdate() not null,
	[enrollment_id] int not null,
	[module_id] int not null,
	constraint fk_grade_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id),
	constraint fk_grade_module_id foreign key (module_id) references Modules(module_id)
);
insert into Grades([grade_id], [grade_number], [graded_date], [enrollment_id], [module_id])
values
(0, 95, getdate(), 0, 0),
(1, 85, getdate(), 0, 1);
go

-- Accomplishments
if object_id('Accomplishments', 'U') is not null drop table Accomplishments;
CREATE TABLE Accomplishments (
    [accomplishment_id] int primary key not null,
    [completion_date] datetime default getdate() not null,
    [overall_grade] int not null,
    [certificate_id] nvarchar(max) not null,
	[enrollment_id] int not null,
    constraint fk_accomplishment_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id)
);
insert Accomplishments ([accomplishment_id], [completion_date], [overall_grade], [certificate_id], [enrollment_id])
values
(0, getdate(), 90, N'BCCPP010', 0);
go

-- CourseFeedbacks
if object_id('CourseFeedbacks', 'U') is not null drop table CourseFeedbacks;
CREATE TABLE CourseFeedbacks (
	[feedback_id] int primary key not null,
    [feedback_description] nvarchar(max) not null,
    [feedback_date] datetime default getdate() not null,
	[enrollment_id] int,
    constraint fk_course_feedback_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id)
);
insert into CourseFeedbacks ([feedback_id], [feedback_description], [feedback_date], [enrollment_id])
values
(0, N'Cảm ơn!', getdate(), 0);
go

-- Fields - flagging field for filtering/searching
if object_id('Fields', 'U') is not null drop table Fields;
create table Fields (
    [field_id] int primary key not null,
    [field_description] nvarchar(100) not null,
);
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

-- Course Field
if object_id('CourseField', 'U') is not null drop table CourseField ;
create table CourseField (
	[course_field_id] int primary key not null,
	[course_id] int not null,
	[field_id] int not null,
	constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id),
	constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id)
);
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

--PROCEDURE
-- For sign in
create procedure ReadAuthentication @account nvarchar(max), @password nvarchar(max)
as
begin
	select [authentication_id], [authorization_id]
    from Authentications
    where [account] = @account and [password] = @password;
end
go

-- For sign up
create procedure AddAuthentication @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int
as
begin
	if (@account is null or @account = '')
		or (@password is null or @password = '')
		or (@identifier_email is null or @identifier_email = '') 
		or (@authorization_id is null)
    begin
		raiserror('Input(s) is missing!', 16, 1);
        return;
    end;

	declare @newID int;

	select top 1 @newID = [authentication_id] + 1
	from Authentications
	order by [authentication_id] desc;

	insert into Authentications ([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
    VALUES (@newID, @account, @password, @identifier_email, getdate(), @authorization_id);
end
go
-- for reset password
create procedure ResetPassword @authentication_id int, @newPassword nvarchar(max)
as
begin
	if (@newPassword is null or @newPassword = '')
		or (@authentication_id is null)
    begin
		raiserror('Input(s) is missing!', 16, 1);
        return;
    end;

	update Authentications
	set
	[password] = @newPassword
	where [authentication_id] = @authentication_id
end
go
-- for remove account

-- for read profile

-- for create profile
-- for update profile
-- for delete profile

-- for read course
create procedure ReadCourse @course_id int
as
begin
    SELECT 
        c.course_id,
        c.course_name,
        c.course_description,
        c.duration,
        c.created_date,
        c.provider_id,
        m.module_id,
        m.module_ordinal,
        m.module_name,
        m.created_date
    FROM Courses c
    LEFT JOIN Modules m ON c.course_id = m.course_id
    WHERE c.course_id = ISNULL(@course_id, c.course_id)
    ORDER BY c.course_id, m.module_ordinal;
END
GO
-- for create course
create procedure CreateCourse 
	@course_name nvarchar(max), 
	@course_description nvarchar(max), 
	@duration nvarchar(max),
	@provider_id int
as
begin
	if (@course_name is null or @course_name = '')
		or (@course_description is null or @course_description = '')
		or (@duration is null or @duration = '') 
		or (@provider_id is null)
    begin
        return;
    end;

	declare @userType int;

	select top 1 @userType = a2.authorization_id
	from Authentications a1
		join Authorizations a2 on a2.authorization_id = a1.authorization_id
		join Users u on u.authentication_id = a1.authentication_id
	where u.user_id = @provider_id

	if (@userType != 1)
	begin
		raiserror('User type is not provider', 16, 1);
        return;
    end;

	declare @newID int;

	select top 1 @newID = [course_id] + 1
	from Courses
	order by [course_id] desc;

	insert into Courses ([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
    VALUES (@newID, @course_name, @course_description, @duration, getdate(), @provider_id);
end
go
-- for update course
-- for delete course