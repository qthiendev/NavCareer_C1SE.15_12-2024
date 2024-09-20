USE master
CREATE DATABASE NavCareerDB;
USE NavCareerDB;

-- Authorizations - role
create table Authorizations (
	[authorization_id] int primary key not null,
	[description] nvarchar(50) not null unique,
)

-- Authentications - user private info
create table Authentications (
	[authentication_id] nvarchar(16) primary key not null,
	[account] nvarchar(50) not null unique,
	[password] nvarchar(18) not null,
	[identifier_email] nvarchar(100) not null unique,
	[created_date] date not null,
	[authorization_id] int not null,
	constraint fk_authentication_authorization_id foreign key (authorization_id) references Authorizations(authorization_id) on delete cascade on update cascade
)

-- Users - user public info
create table Users (
	[user_id] nvarchar(16) primary key not null,
	[user_name] nvarchar(max) not null,
	[email] nvarchar(max),
	[birthdate] DATE not null,
	[gender] bit not null,
	[phone_number] nvarchar(15),
	[address] nvarchar(max),
	[date_joined] date not null,
	[authentication_id] nvarchar(16),
	constraint fk_user_authentication_id foreign key (authentication_id) references Authentications(authentication_id) on delete cascade on update cascade
)

-- QuestionTypes - type for sever render
create table QuestionTypes (
    [question_type_id] int primary key not null,
    [type_description] nvarchar(max) not null
);

-- Questions
create table Questions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null,
    [question_type_id] int not null,
    constraint fk_question_question_type_id foreign key (question_type_id) references QuestionTypes(question_type_id) on delete cascade on update cascade
);

-- Answers
create table Answers (
    [answer_id] INT PRIMARY KEY,
    [answer_description] TEXT NOT NULL,
	[question_id] INT NOT NULL,
    constraint fk_answer_question_id foreign key (question_id) references Questions(question_id) on delete cascade on update cascade,
);

-- Courses
create table Courses (
    [course_id] nvarchar(16) primary key,
    [course_name] nvarchar(500) not null unique,
    [course_description] nvarchar(max) not null,
    [duration] nvarchar(50), -- 1 month, 2 months, 3 years,...
    [level] VARCHAR(50),
    [created_date] DATETIME DEFAULT GETDATE(),
	[local_resource_url] nvarchar(500) not null unique, -- include vids, plain texts, questions/answers -> for sercure purpose
	[user_id] nvarchar(16), -- provider -> add trigger that make sure user role is ESP
    constraint fk_course_user_id foreign key (user_id) references Users(user_id) on delete cascade on update cascade,
);

-- CourseMaterials - Course's materials
create table CourseMaterials (
	[material_id] int primary key,
	[material_name] nvarchar(max) not null,
	[material_description] nvarchar(max) not null,
	[material_resource_url] nvarchar(max) not null,
	[created_date] DATETIME DEFAULT GETDATE() not null,
	[course_id] nvarchar(16),
	constraint fk_material_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
);

create table EnrollmentStatus (
	[status_id] int primary key,
	[status_description] nvarchar(max)
)

create table Enrollments (
    enrollment_id int not null unique,
    student_id nvarchar(16) NOT NULL,
    course_id nvarchar(16) NOT NULL,
    enrollment_date DATETIME DEFAULT GETDATE(),
    status_id int not null,
    constraint fk_enrollment_student_id foreign key (student_id) references Users(user_id) on delete cascade on update cascade,
    constraint fk_enrollment_course_id foreign key (course_id) references Courses(course_id),
	constraint fk_enrollment_status_id foreign key (status_id) references EnrollmentStatus(status_id),
	constraint PK_Enrollments primary key ([enrollment_id], [student_id], [course_id])
);

-- Grade
create table Grades (
	[grade_id] int not null unique,
	[enrollment_id] int not null,
	[material_id] int not null,
	[grade_number] int not null,
	[graded_date] DATETIME DEFAULT GETDATE() not null,
	constraint fk_grade_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete cascade on update cascade,
	constraint fk_grade_material_id foreign key (material_id) references CourseMaterials(material_id),
	constraint PK_Grades primary key ([grade_id], [enrollment_id], [material_id])
);

-- Accomplishments
CREATE TABLE Accomplishments (
    [accomplishment_id] nvarchar(30) PRIMARY KEY,
    [student_id] nvarchar(16),
    [course_id] nvarchar(16),
    [completion_date] DATETIME DEFAULT GETDATE(),
    [overall_grade] int,
    [certificate_id] nvarchar(max),
    constraint fk_accomplishment_student_id foreign key (student_id) references Users(user_id) on delete cascade on update cascade,
    constraint fk_accomplishment_course_id foreign key (course_id) references Courses(course_id),
);

-- Comments
CREATE TABLE CourseFeedbacks (
	[feedback_id] INT PRIMARY KEY,
    [feedback_description] nvarchar(max),
    [feedback_date] DATETIME DEFAULT GETDATE(),
	[course_id] nvarchar(16)  NOT NULL,
	[user_id] nvarchar(16) NOT NULL, -- make sure user enrolled and get Accomplishments
    constraint fk_feedback_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
    constraint fk_feedback_student_id foreign key (user_id) references Users(user_id),
);

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] nvarchar(16) primary key,
    [field_description] nvarchar(100),
);

create table CourseField (
	[course_field_id] int not null unique,
	[course_id] nvarchar(16) not null,
	[field_id] nvarchar(16) not null,
	constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
	constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id),
	constraint PK_CourseFeild primary key ([course_field_id], [course_id], [field_id])
)

create table UserField (
	[course_field_id] int,
	[user_id] nvarchar(16) not null,
	[field_id] nvarchar(16) not null,
	constraint fk_user_field_course_id foreign key (user_id) references Users(user_id) on delete cascade on update cascade,
	constraint fk_user_field_field_id foreign key (field_id) references Fields(field_id),
	constraint PK_UserField primary key ([course_field_id], [user_id], [field_id])
)

-- Feedbacks
CREATE TABLE SystemFeedbacks (
    [feedback_id] INT PRIMARY KEY,
    [feedback_description] nvarchar(max),
    [feedback_date] DATETIME DEFAULT GETDATE(),
	[user_id] nvarchar(16) NOT NULL,
    constraint fk_feedback_user_id foreign key (user_id) references Users(user_id)
);