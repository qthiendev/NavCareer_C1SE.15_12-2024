USE master
CREATE DATABASE NavCareerDB;
USE NavCareerDB;

-- Questions
create table NavQuestions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null,
);

-- Answers
create table NavAnswers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null,
	[question_id] int not null,
    constraint fk_nav_answer_question_id foreign key (question_id) references NavQuestions(question_id) on delete cascade on update cascade,
);

-- Authorizations - role
create table Authorizations (
	[authorization_id] int primary key not null,
	[description] nvarchar(50) not null unique,
)

-- Authentications - user private info
create table Authentications (
	[authentication_id] int primary key not null,
	[account] nvarchar(50) not null unique,
	[password] nvarchar(18) not null,
	[identifier_email] nvarchar(100) not null unique,
	[created_date] date default getdate() not null,
	[authorization_id] int not null,
	constraint fk_authentication_authorization_id foreign key (authorization_id) references Authorizations(authorization_id) on delete cascade on update cascade
)

-- Users - user public info
create table Users (
	[user_id] int primary key not null,
	[user_name] nvarchar(max) not null,
	[email] nvarchar(max),
	[birthdate] date default getdate(),
	[gender] bit,
	[phone_number] nvarchar(15),
	[address] nvarchar(max),
	[date_joined] date default getdate() not null,
	[avatar_img] varbinary(MAX),
	[cover_img] varbinary(MAX),
	[authentication_id] int,
	constraint fk_user_authentication_id foreign key (authentication_id) references Authentications(authentication_id) on delete cascade on update cascade
)

-- Courses
create table Courses (
    [course_id] int primary key not null,
    [course_name] nvarchar(500) not null unique,
    [course_description] nvarchar(max) not null,
    [duration] nvarchar(50) not null, -- 1 month, 2 months, 3 years,...
    [created_date] date default getdate() not null,
	[user_id] int not null, -- provider -> add trigger that make sure user role is ESP
    constraint fk_course_user_id foreign key (user_id) references Users(user_id) on delete cascade on update cascade,
);

-- Modules - Course's modules
create table Modules (
	[module_id] int primary key not null,
	[module_ordinal] int not null,
	[module_name] nvarchar(max) not null,
	[module_description] nvarchar(max) not null,
	[created_date] date default getdate() not null,
	[course_id] int,
	constraint fk_module_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
);

create table CollectionTypes (
	[collection_type_id] int primary key not null,
	[collection_name] nvarchar(max) -- Type for page render
)

-- Collections - Module's Collections
create table Collections (
	[collection_id] int primary key,
	[collection_ordinal] int not null,
	[collection_name] nvarchar(max) not null,
	[created_date] date default getdate() not null,
	[module_id] int,
	[collection_type_id] int,
	constraint fk_collection_module_id foreign key (module_id) references Modules(module_id) on delete cascade on update cascade,
	constraint fk_collection_collection_type_id foreign key (collection_type_id) references CollectionTypes(collection_type_id),
);

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
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null,
	[is_right] bit not null,
	[question_id] int not null,
    constraint fk_answer_question_id foreign key (question_id) references Questions(question_id) on delete cascade on update cascade,
);

-- Materials - Collection's materials
create table Materials (
	[material_id] int primary key,
	[material_ordinal] int not null,
	[text] nvarchar(max),
	[image] varbinary(max),
	[video_url] nvarchar(max),
	[question_id] int,
	[collection_id] int,
	constraint fk_material_collection_id foreign key (collection_id) references Collections(collection_id) on delete cascade on update cascade,
	constraint fk_material_question_id foreign key (question_id) references Questions(question_id),
);

create table EnrollmentStatus (
	[status_id] int primary key,
	[status_description] nvarchar(max)
)

create table Enrollments (
    enrollment_id int not null unique,
    student_id int NOT NULL,
    course_id int NOT NULL,
    enrollment_date date default getdate(),
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
	[module_id] int not null,
	[grade_number] int not null,
	[graded_date] DATETIME DEFAULT GETDATE() not null,
	constraint fk_grade_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete cascade on update cascade,
	constraint fk_grade_module_id foreign key (module_id) references Modules(module_id),
	constraint PK_Grades primary key ([grade_id], [enrollment_id], [module_id])
);

-- Accomplishments
CREATE TABLE Accomplishments (
    [accomplishment_id] int PRIMARY KEY,
    [student_id] int,
    [course_id] int,
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
	[course_id] int  NOT NULL,
	[user_id] int NOT NULL, -- make sure user enrolled and get Accomplishments
    constraint fk_feedback_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
    constraint fk_feedback_student_id foreign key (user_id) references Users(user_id),
);

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] int primary key,
    [field_description] nvarchar(100),
);

create table CourseField (
	[course_field_id] int not null unique,
	[course_id] int not null,
	[field_id] int not null,
	constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id) on delete cascade on update cascade,
	constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id),
	constraint PK_CourseFeild primary key ([course_field_id], [course_id], [field_id])
)

create table UserField (
	[user_field_id] int,
	[user_id] int not null,
	[field_id] int not null,
	constraint fk_user_field_course_id foreign key (user_id) references Users(user_id) on delete cascade on update cascade,
	constraint fk_user_field_field_id foreign key (field_id) references Fields(field_id),
	constraint PK_UserField primary key ([course_field_id], [user_id], [field_id])
)

-- Feedbacks
CREATE TABLE SystemFeedbacks (
    [feedback_id] INT PRIMARY KEY,
    [feedback_description] nvarchar(max),
    [feedback_date] DATETIME DEFAULT GETDATE(),
	[user_id] int NOT NULL,
    constraint fk_feedback_user_id foreign key (user_id) references Users(user_id)
);