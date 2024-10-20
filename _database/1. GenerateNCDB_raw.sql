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
go
if object_id('Fields', 'U') is not null drop table Fields;
go
if object_id('CourseFeedbacks', 'U') is not null drop table CourseFeedbacks;
go
if object_id('Accomplishments', 'U') is not null drop table Accomplishments;
go
if object_id('Grades', 'U') is not null drop table Grades;                     
go
if object_id('UserTracking', 'U') is not null drop table UserTracking;         
go 
if object_id('Enrollments', 'U') is not null drop table Enrollments;		   
go
if object_id('MaterialQuestion', 'U') is not null drop table MaterialQuestion; 
go
if object_id('Materials', 'U') is not null drop table Materials;			   
go
if object_id('MaterialType', 'U') is not null drop table MaterialType;		   
go
if object_id('Answers', 'U') is not null drop table Answers;				   
go
if object_id('Questions', 'U') is not null drop table Questions;			   
go
if object_id('QuestionTypes', 'U') is not null drop table QuestionTypes;	   
go
if object_id('Collections', 'U') is not null drop table Collections;		   
go
if object_id('CollectionTypes', 'U') is not null drop table CollectionTypes;   
go
if object_id('Modules', 'U') is not null drop table Modules;				   
go
if object_id('Courses', 'U') is not null drop table Courses;				   
go
if object_id('SystemFeedbacks', 'U') is not null drop table SystemFeedbacks;   
go
if object_id('Users', 'U') is not null drop table Users;					   
go
if object_id('AuthProcedureBanned', 'U') is not null drop table AuthProcedureBanned;		   
go
if object_id('Authentications', 'U') is not null drop table Authentications;   
go
if object_id('Authorizations', 'U') is not null drop table Authorizations;	   
go
if object_id('NavAnswers', 'U') is not null drop table NavAnswers;			   
go
if object_id('NavQuestions', 'U') is not null drop table NavQuestions;		   
go

-- NavQuestions
create table NavQuestions (
    [question_id] int primary key not null,
    [question_description] nvarchar(512) not null
);
go

-- NavAnswers
create table NavAnswers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(512) not null, 
    [question_id] int not null,
    constraint fk_nav_answer_question_id foreign key ([question_id]) references NavQuestions([question_id]) 
);
go

-- Authorizations - role
create table Authorizations (
    [authorization_id] int primary key not null,
    [role] nvarchar(32) not null unique 
);
go

-- Authentications - user private info
create table Authentications (
    [authentication_id] int primary key not null,
    [account] varbinary(700) not null unique,
    [password] varbinary(700) not null, 
    [identifier_email] varbinary(700) not null unique,
    [created_date] datetime default getdate() not null,
    [authorization_id] int null,
	[auth_state] bit default 1 not null,
    constraint fk_authentication_authorization_id foreign key ([authorization_id]) references Authorizations([authorization_id]) on delete set null
);
go

-- AuthProcedureBanned
create table AuthProcedureBanned (
	[id] int primary key not null,
	[procedure_name] nvarchar(512) not null,
	[authentication_id] int not null,
	constraint fk_auth_procedure_authentication_id foreign key ([authentication_id]) references Authentications([authentication_id]) on delete cascade
);
go

if object_id('dbo.IsUserBanned', 'fn') is not null drop function dbo.IsUserBanned;
go
create function dbo.IsUserBanned (@aid int, @procedurename nvarchar(512))
returns bit
as
begin
	declare @isbanned bit = 0;

    if exists (
		select 1 
		from AuthProcedureBanned
		where [authentication_id] = @aid
			and [procedure_name] = @procedurename
	)
    begin
        set @isbanned = 1;
    end
	
    return @isbanned;
end;
go

-- Users - user public info
create table Users (
    [user_id] int primary key not null,
    [user_full_name] nvarchar(255) not null,
	[user_alias] nvarchar(255) unique,
	[user_bio] nvarchar(1024),
    [user_birthdate] datetime,
    [user_gender] bit,
	[user_email] nvarchar(512), 
    [user_phone_number] nvarchar(20),
    [user_address] nvarchar(512), 
    [user_created_date] datetime default getdate() not null,
    [user_resource_url] nvarchar(128) unique,
	[user_status] bit default 1 not null,
    [authentication_id] int null,
    constraint fk_user_authentication_id foreign key ([authentication_id]) references Authentications([authentication_id]) on delete set null
);
go

-- Feedbacks
create table SystemFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] nvarchar(512) not null, 
    [feedback_date] datetime default getdate() not null,
    [user_id] int null,
    constraint fk_feedback_user_id foreign key ([user_id]) references Users([user_id]) on delete set null
);
go

-- Courses
create table Courses (
    [course_id] int primary key not null,
    [course_name] nvarchar(512) not null unique,
	[course_short_description] nvarchar(1024) not null,
    [course_full_description] nvarchar(max) not null,
    [course_price] int not null,
    [course_duration] nvarchar(128) not null, 
    [course_created_date] datetime default getdate() not null,
	[course_resource_url] nvarchar(128) unique,
	[course_piority_index] int not null,
	[course_status] bit default 1 not null,
    [user_id] int null,
    constraint fk_course_provider_id foreign key ([user_id]) references Users([user_id]) on delete set null
);
go

-- Modules - Course's modules
create table Modules (
    [module_id] int primary key not null,
    [module_name] nvarchar(1024) not null, 
    [module_created_date] datetime default getdate() not null,
    [module_ordinal] int not null,
    [course_id] int null,
    constraint fk_module_course_id foreign key ([course_id]) references Courses([course_id]) on delete set null
);
go

-- Collection Types
create table CollectionTypes (
    [collection_type_id] int primary key not null,
    [collection_type_name] nvarchar(512) not null
);
go

-- Collections - Module's Collections
create table Collections (
    [collection_id] int primary key not null,
    [collection_name] nvarchar(1024) not null, 
    [collection_created_date] datetime default getdate() not null,
    [collection_ordinal] int not null,
    [collection_type_id] int null,
    [module_id] int null,
    constraint fk_collection_collection_type_id foreign key ([collection_type_id]) references CollectionTypes([collection_type_id]) on delete set null,
    constraint fk_collection_module_id foreign key ([module_id]) references Modules([module_id]) on delete set null 
);
go

-- Question Types - type for server render
create table QuestionTypes (
    [question_type_id] int primary key not null,
    [question_type_name] nvarchar(512) not null 
);
go

-- Questions
create table Questions (
    [question_id] int primary key not null,
    [question_description] nvarchar(max) not null, 
    [question_type_id] int not null,
    constraint fk_question_question_type_id foreign key ([question_type_id]) references QuestionTypes([question_type_id]) 
);
go

-- Answers
create table Answers (
    [answer_id] int primary key not null,
    [answer_description] nvarchar(max) not null, 
    [answer_is_right] bit not null,
    [question_id] int null,
    constraint fk_answer_question_id foreign key ([question_id]) references Questions([question_id]) 
);
go

-- Material Types
create table MaterialType (
    [material_type_id] int primary key not null,
    [material_type_name] nvarchar(512) not null 
);
go

-- Materials - Collection's materials
create table Materials (
    [material_id] int primary key not null,
    [material_content] nvarchar(max), 
    [material_ordinal] int not null,
    [material_type_id] int not null,
    [collection_id] int null,
    constraint fk_material_material_type_id foreign key ([material_type_id]) references MaterialType([material_type_id]), 
    constraint fk_material_collection_id foreign key ([collection_id]) references Collections([collection_id]) on delete set null,
);
go

create table MaterialQuestion (
    [id] int primary key not null,
    [material_id] int not null,
    [question_id] int not null,
    constraint fk_material_question_material_id foreign key ([material_id]) references Materials([material_id]) on delete cascade,
    constraint fk_material_question_question_id foreign key ([question_id]) references Questions([question_id]) on delete cascade,
);
go

-- Enrollments - after nav_student enroll a course
create table Enrollments (
    [enrollment_id] int primary key not null,
    [enrollment_date] datetime default getdate() not null,
    [enrollment_is_complete] bit default 0 not null,
    [user_id] int null,
    [course_id] int null,
    constraint fk_enrollment_nav_student_id foreign key ([user_id]) references Users([user_id]) on delete set null,
    constraint fk_enrollment_course_id foreign key ([course_id]) references Courses([course_id]) on delete set null,
);
go

-- Tracking - enrollment tracking
create table UserTracking (
    [tracking_id] int primary key not null,
    [enrollment_id] int null,
    [collection_id] int null,
    constraint fk_tracking_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete cascade,
    constraint fk_tracking_collection_id foreign key ([collection_id]) references Collections([collection_id]) on delete cascade
);
go

-- Grade
create table Grades (
    [grade_id] int primary key not null,
    [grade_number] int not null,
    [graded_date] datetime default getdate() not null,
    [enrollment_id] int null,
    [module_id] int null,
    constraint fk_grade_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete cascade,
    constraint fk_grade_module_id foreign key ([module_id]) references Modules([module_id]) on delete cascade
);
go

-- Accomplishments
create table Accomplishments (
    [accomplishment_id] int primary key not null,
    [accomplishment_completion_date] datetime default getdate() not null,
    [accomplishment_overall_grade] int not null,
    [accomplishment_certificate_id] nvarchar(512) not null unique, 
    [enrollment_id] int not null,
    constraint fk_accomplishment_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete cascade,
);
go

-- Course Feedbacks
create table CourseFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] nvarchar(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [enrollment_id] int not null,
    constraint fk_course_feedback_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete cascade
);
go

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] int primary key not null,
    [field_name] nvarchar(512) not null 
);
go

-- Course Field
create table CourseField (
    [course_field_id] int primary key not null,
    [course_id] int not null,
    [field_id] int not null,
    constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id) on delete cascade,
    constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id) on delete cascade
);
go