go
use master;
go
if exists(select * from sys.databases where name = 'NavCareerDB')
begin
    alter database NavCareerDB set single_user with rollback immediate;
    drop database NavCareerDB;
end
go

-- Recreate the database
create database NavCareerDB;
go


use NavCareerDB;
go

-- Drop
if object_id('CourseField', 'U') is not null drop table CourseField;
if object_id('Fields', 'U') is not null drop table Fields;
if object_id('CourseFeedbacks', 'U') is not null drop table CourseFeedbacks;
if object_id('Accomplishments', 'U') is not null drop table Accomplishments;
if object_id('Grades', 'U') is not null drop table Grades;
if object_id('UserTracking', 'U') is not null drop table UserTracking;
if object_id('Enrollments', 'U') is not null drop table Enrollments;
if object_id('Materials', 'U') is not null drop table Materials;
if object_id('MaterialType', 'U') is not null drop table MaterialType;
if object_id('Answers', 'U') is not null drop table Answers;
if object_id('Questions', 'U') is not null drop table Questions;
if object_id('QuestionTypes', 'U') is not null drop table QuestionTypes;
if object_id('Collections', 'U') is not null drop table Collections;
if object_id('CollectionTypes', 'U') is not null drop table CollectionTypes;
if object_id('Modules', 'U') is not null drop table Modules;
if object_id('Courses', 'U') is not null drop table Courses;
if object_id('SystemFeedbacks', 'U') is not null drop table SystemFeedbacks;
if object_id('UserProcedureBanned', 'U') is not null drop table UserProcedureBanned;
if object_id('Users', 'U') is not null drop table Users;
if object_id('Authentications', 'U') is not null drop table Authentications;
if object_id('Authorizations', 'U') is not null drop table Authorizations;
if object_id('NavAnswers', 'U') is not null drop table NavAnswers;
if object_id('NavQuestions', 'U') is not null drop table NavQuestions;
go

-- NavQuestions
create table NavQuestions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null 
);
go

-- NavAnswers
create table NavAnswers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null, 
    [question_id] int null,
    constraint fk_nav_answer_question_id foreign key (question_id) references NavQuestions(question_id) on delete set null on update cascade
);
go

-- Authorizations - role
create table Authorizations (
    [authorization_id] int primary key not null,
    [role] nvarchar(1000) not null unique 
);
go

-- Authentications - user private info
create table Authentications (
    [authentication_id] int primary key not null,
    [account] varbinary(1000) not null unique,
    [password] varbinary(max) not null, 
    [identifier_email] varbinary(1000) not null unique,
    [created_date] datetime default getdate() not null,
    [authorization_id] int null,
	[is_active] bit default 1 not null,
    constraint fk_authentication_authorization_id foreign key (authorization_id) references Authorizations(authorization_id) on delete set null on update cascade
);
go

-- Users - user public info
create table Users (
    [user_id] int primary key not null,
    [user_full_name] nvarchar(max) not null, 
    [birthdate] datetime,
    [gender] bit,
	[email] nvarchar(max), 
    [phone_number] nvarchar(max),
    [address] nvarchar(max), 
    [date_joined] datetime default getdate() not null,
    [resource_url] nvarchar(max), 
    [authentication_id] int null,
	[is_active] bit default 1 not null,
    constraint fk_user_authentication_id foreign key (authentication_id) references Authentications(authentication_id) on delete set null on update cascade
);
go

-- Feedbacks
create table SystemFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] nvarchar(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [user_id] int null,
    constraint fk_feedback_user_id foreign key (user_id) references Users(user_id) on delete set null on update cascade
);
go

-- Courses
create table Courses (
    [course_id] int primary key not null,
    [course_name] nvarchar(max) not null, 
    [course_description] nvarchar(max) not null, 
    [duration] nvarchar(max) not null, 
    [created_date] datetime default getdate() not null,
    [provider_id] int null,
    constraint fk_course_provider_id foreign key (provider_id) references Users(user_id) on delete set null on update cascade
);
go

-- Modules - Course's modules
create table Modules (
    [module_id] int primary key not null,
    [module_name] nvarchar(max) not null, 
    [created_date] datetime default getdate() not null,
    [module_ordinal] int not null,
    [course_id] int null,
    constraint fk_module_course_id foreign key (course_id) references Courses(course_id) on delete set null on update cascade
);
go

-- Collection Types
create table CollectionTypes (
    [collection_type_id] int primary key not null,
    [collection_type_name] nvarchar(max) 
);
go

-- Collections - Module's Collections
create table Collections (
    [collection_id] int primary key not null,
    [collection_name] nvarchar(max) not null, 
    [created_date] datetime default getdate() not null,
    [collection_ordinal] int not null,
    [collection_type_id] int null,
    [module_id] int null,
    constraint fk_collection_collection_type_id foreign key (collection_type_id) references CollectionTypes(collection_type_id) on delete set null on update cascade,
    constraint fk_collection_module_id foreign key (module_id) references Modules(module_id) on delete set null on update cascade
);
go

-- Question Types - type for server render
create table QuestionTypes (
    [question_type_id] int primary key not null,
    [type_description] nvarchar(max) not null 
);
go

-- Questions
create table Questions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null, 
    [question_type_id] int null,
    constraint fk_question_question_type_id foreign key (question_type_id) references QuestionTypes(question_type_id) on delete set null on update cascade
);
go

-- Answers
create table Answers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null, 
    [is_right] bit not null,
    [question_id] int null,
    constraint fk_answer_question_id foreign key (question_id) references Questions(question_id) on delete set null on update cascade
);
go

-- Material Types
create table MaterialType (
    [material_type_id] int primary key not null,
    [material_type_name] nvarchar(max) not null 
);
go

-- Materials - Collection's materials
create table Materials (
    [material_id] int primary key not null,
    [material_content] nvarchar(max), 
    [material_ordinal] int not null,
    [material_type_id] int null,
    [collection_id] int null,
    constraint fk_material_material_type_id foreign key (material_type_id) references MaterialType(material_type_id) on delete set null on update cascade, 
    constraint fk_material_collection_id foreign key (collection_id) references Collections(collection_id) on delete set null on update cascade
);
go

-- Enrollments - after nav_student enroll a course
create table Enrollments (
    [enrollment_id] int primary key not null,
    [enrollment_date] datetime default getdate() not null,
    [is_complete] bit default 0 not null,
    [user_id] int null,
    [course_id] int null,
    constraint fk_enrollment_nav_student_id foreign key (user_id) references Users(user_id) on delete set null on update cascade,
    constraint fk_enrollment_course_id foreign key (course_id) references Courses(course_id) on delete set null
);
go

-- Tracking - enrollment tracking
create table UserTracking (
    [tracking_id] int primary key not null,
    [enrollment_id] int null,
    [collection_id] int null,
    constraint fk_tracking_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete set null on update cascade,
    constraint fk_tracking_collection_id foreign key (collection_id) references Collections(collection_id) on delete set null
);
go

-- Grade
create table Grades (
    [grade_id] int primary key not null,
    [grade_number] int not null,
    [graded_date] datetime default getdate() not null,
    [enrollment_id] int null,
    [module_id] int null,
    constraint fk_grade_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete set null on update cascade,
    constraint fk_grade_module_id foreign key (module_id) references Modules(module_id) on delete set null
);
go

-- Accomplishments
create table Accomplishments (
    [accomplishment_id] int primary key not null,
    [completion_date] datetime default getdate() not null,
    [overall_grade] int not null,
    [certificate_id] nvarchar(max) not null, 
    [enrollment_id] int null,
    constraint fk_accomplishment_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete set null on update cascade
);
go

-- Course Feedbacks
create table CourseFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] nvarchar(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [enrollment_id] int null,
    constraint fk_course_feedback_enrollment_id foreign key (enrollment_id) references Enrollments(enrollment_id) on delete set null on update cascade
);
go

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] int primary key not null,
    [field_description] nvarchar(max) not null 
);
go

-- Course Field
create table CourseField (
    [course_field_id] int primary key not null,
    [course_id] int null,
    [field_id] int null,
    constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id) on delete set null on update cascade,
    constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id) on delete set null on update cascade
);
go

-- UserProcedureBanned
create table UserProcedureBanned (
	[banned_id] int primary key not null,
	[procedure_name] nvarchar(max),
	[authentication_id] int null,
	constraint fk_banned_user_id foreign key (authentication_id) references Authentications(authentication_id) on delete set null on update cascade
);
go

if object_id('dbo.IsUserBanned', 'fn') is not null drop function dbo.IsUserBanned;
go
create function dbo.IsUserBanned (@aid int, @procedurename nvarchar(max))
returns bit
as
begin
	declare @isbanned bit = 0;

    if exists (
		select 1 
		from UserProcedureBanned 
		where authentication_id = @aid
			and procedure_name = @procedurename
	)
    begin
        set @isbanned = 1;
    end
	
    return @isbanned;
end;
go