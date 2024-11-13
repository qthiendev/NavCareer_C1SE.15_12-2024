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
if object_id('Payments', 'U') is not null drop table Payments;					   
go
if object_id('Users', 'U') is not null drop table Users;					   
go
if object_id('AuthProcedureBanned', 'U') is not null drop table AuthProcedureBanned;		   
go
if object_id('Authentications', 'U') is not null drop table Authentications;   
go
if object_id('Authorizations', 'U') is not null drop table Authorizations;	   
go

-- Authorizations - role
create table Authorizations (
    [authorization_id] int identity(0, 1) primary key,
    [role] nvarchar(32) not null unique 
);
go

-- Authentications - user private info
create table Authentications (
    [authentication_id] int identity(0, 1) primary key,
    [account] varbinary(700) not null unique,
    [password] varbinary(700) not null, 
    [identifier_email] varbinary(700) not null unique,
    [created_date] datetime default getdate() not null,
	[auth_status] bit default 1 not null,
    [authorization_id] int null,
    constraint fk_authentication_authorization_id foreign key ([authorization_id]) references Authorizations([authorization_id]) on delete set null on update cascade
);
go

-- AuthProcedureBanned
create table AuthProcedureBanned (
	[id] int identity(0, 1) primary key,
	[procedure_name] nvarchar(512) not null,
	[authentication_id] int null,
	constraint fk_auth_procedure_authentication_id foreign key ([authentication_id]) references Authentications([authentication_id]) on delete set null on update cascade
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
    [user_id] int identity(0, 1) primary key,
    [user_full_name] nvarchar(255) not null,
	[user_alias] nvarchar(255) unique,
	[user_bio] nvarchar(1024),
    [user_birthdate] datetime,
    [user_gender] bit,
	[user_email] nvarchar(512), 
    [user_phone_number] nvarchar(50),
    [user_address] nvarchar(512), 
    [user_created_date] datetime default getdate() not null,
	[user_status] bit default 1 not null,
    [authentication_id] int null,
    constraint fk_user_authentication_id foreign key ([authentication_id]) references Authentications([authentication_id]) on delete set null on update cascade 
);
go

-- Payment info
create table Payments (
    [payment_id] int identity(0, 1) primary key,
    [payment_transaction_id] nvarchar(255) not null unique,
	[payment_description] nvarchar(512) not null,
	[payment_date] datetime not null,
	[payment_state] bit not null default 0,
	[authentication_id] int null,
    constraint fk_payment_authentication_id foreign key ([authentication_id]) references Authentications([authentication_id]) on delete set null on update cascade 
);
go

-- Feedbacks
create table SystemFeedbacks (
    [feedback_id] int identity(0, 1) primary key,
    [feedback_description] nvarchar(512) not null, 
    [feedback_date] datetime default getdate() not null,
    [user_id] int null,
    constraint fk_feedback_user_id foreign key ([user_id]) references Users([user_id]) on delete set null on update cascade
);
go

-- Courses
create table Courses (
    [course_id] int identity(0, 1) primary key,
    [course_name] nvarchar(512) not null unique,
	[course_short_description] nvarchar(1024) not null,
    [course_full_description] nvarchar(max) not null,
    [course_price] int not null,
    [course_duration] nvarchar(128) not null, 
    [course_created_date] datetime default getdate() not null,
	[course_piority_index] int not null,
	[course_status] bit default 1 not null,
    [user_id] int null,
    constraint fk_course_provider_id foreign key ([user_id]) references Users([user_id]) on delete set null on update cascade
);
go

-- Modules - Course's modules
create table Modules (
    [module_id] int identity(0, 1) primary key,
    [module_name] nvarchar(1024) not null, 
    [module_created_date] datetime default getdate() not null,
    [module_ordinal] int not null,
    [course_id] int null,
    constraint fk_module_course_id foreign key ([course_id]) references Courses([course_id]) on delete set null on update cascade
);
go

-- Collection Types
create table CollectionTypes (
    [collection_type_id] int identity(0, 1) primary key,
    [collection_type_name] nvarchar(512) not null
);
go

-- Collections - Module's Collections
create table Collections (
    [collection_id] int identity(0, 1) primary key,
    [collection_name] nvarchar(1024) not null, 
    [collection_created_date] datetime default getdate() not null,
    [collection_ordinal] int not null,
    [collection_type_id] int null,
    [module_id] int null,
    constraint fk_collection_collection_type_id foreign key ([collection_type_id]) references CollectionTypes([collection_type_id]) on delete set null on update cascade,
    constraint fk_collection_module_id foreign key ([module_id]) references Modules([module_id]) on delete set null on update cascade 
);
go

-- Material Types
create table MaterialType (
    [material_type_id] int identity(0, 1) primary key,
    [material_type_name] nvarchar(512) not null 
);
go

-- Materials - Collection's materials
create table Materials (
    [material_id] int identity(0, 1) primary key,
    [material_content] nvarchar(max), 
    [material_ordinal] int not null,
    [material_type_id] int null,
    [collection_id] int null,
    constraint fk_material_material_type_id foreign key ([material_type_id]) references MaterialType([material_type_id]) on delete set null on update cascade, 
    constraint fk_material_collection_id foreign key ([collection_id]) references Collections([collection_id]) on delete set null on update cascade,
);

-- Question Types - type for server render
create table QuestionTypes (
    [question_type_id] int identity(0, 1) primary key,
    [question_type_name] nvarchar(512) not null 
);
go

-- Questions
create table Questions (
    [question_id] int identity(0, 1) primary key,
    [question_description] nvarchar(max) not null, 
	[question_ordinal] int not null, 
    [question_type_id] int null,
	[material_id] int null,
    constraint fk_question_question_type_id foreign key ([question_type_id]) references QuestionTypes([question_type_id]) on delete set null on update cascade,
	constraint fk_question_material_id foreign key ([material_id]) references Materials([material_id]) on delete set null on update cascade,
);
go

-- Answers
create table Answers (
    [answer_id] int identity(0, 1) primary key,
    [answer_description] nvarchar(max) not null,
	[answer_ordinal] int not null, 
    [answer_is_right] bit not null,
    [question_id] int null,
    constraint fk_answer_question_id foreign key ([question_id]) references Questions([question_id]) on delete set null on update cascade
);
go

-- Enrollments - after nav_student enroll a course
create table Enrollments (
    [enrollment_id] int identity(0, 1) primary key,
    [enrollment_date] datetime default getdate() not null,
    [enrollment_is_complete] bit default 0 not null,
    [user_id] int null,
    [course_id] int null,
    constraint fk_enrollment_student_id foreign key ([user_id]) references Users([user_id]) on delete set null,
    constraint fk_enrollment_course_id foreign key ([course_id]) references Courses([course_id]) on delete set null
);
go

-- Tracking - enrollment tracking
create table UserTracking (
    [tracking_id] int identity(0, 1) primary key,
    [enrollment_id] int null,
    [collection_id] int null,
    constraint fk_tracking_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete set null,
    constraint fk_tracking_collection_id foreign key ([collection_id]) references Collections([collection_id]) on delete set null
);
go

-- Grade
create table Grades (
    [grade_id] int identity(0, 1) primary key,
    [grade_number] int not null,
    [graded_date] datetime default getdate() not null,
    [enrollment_id] int null,
    [module_id] int null,
    constraint fk_grade_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete set null,
    constraint fk_grade_module_id foreign key ([module_id]) references Modules([module_id]) on delete set null
);
go

-- Accomplishments
create table Accomplishments (
    [accomplishment_id] int identity(0, 1) primary key,
    [accomplishment_completion_date] datetime default getdate() not null,
    [accomplishment_overall_grade] int not null,
    [accomplishment_certificate_id] nvarchar(512) not null unique, 
    [enrollment_id] int null,
    constraint fk_accomplishment_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete set null on update cascade,
);
go

-- Course Feedbacks
create table CourseFeedbacks (
    [feedback_id] int identity(0, 1) primary key,
    [feedback_description] nvarchar(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [enrollment_id] int null,
    constraint fk_course_feedback_enrollment_id foreign key ([enrollment_id]) references Enrollments([enrollment_id]) on delete set null on update cascade
);
go

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] int identity(0, 1) primary key,
    [field_name] nvarchar(512) not null 
);
go

-- Course Field
create table CourseField (
    [course_field_id] int identity(0, 1) primary key,
    [course_id] int null,
    [field_id] int null,
    constraint fk_course_field_course_id foreign key (course_id) references Courses(course_id) on delete set null on update cascade,
    constraint fk_course_field_field_id foreign key (field_id) references Fields(field_id) on delete set null on update cascade
);
go


if object_id('CreateAuthorization', 'P') is not null drop procedure CreateAuthorization;
go
create procedure CreateAuthorization @role nvarchar(max), @role_password varchar(max)
as
begin
	if exists (select 1 from sys.server_principals where name = @role) 
	begin
		declare session_cursor cursor for
		select session_id
		from sys.dm_exec_sessions
		where login_name = @role;

		declare @session_id smallint;
		open session_cursor;
		fetch next from session_cursor into @session_id;

		while @@fetch_status = 0
		begin
			declare @sql nvarchar(100);
			set @sql = 'kill ' + cast(@session_id as nvarchar(5));
			exec sp_executesql @sql;
			fetch next from session_cursor into @session_id;
		end

		close session_cursor;
		deallocate session_cursor;

		declare @sql_disable_login nvarchar(max);
		set @sql_disable_login = 'alter login [' + @role + '] disable';
		exec sp_executesql @sql_disable_login;
	end

	if exists (select 1 from sys.server_principals where name = @role) 
	begin
		declare @sql_drop_login nvarchar(max);
		set @sql_drop_login = 'drop login [' + @role + ']';
		exec sp_executesql @sql_drop_login;
	end

	if exists (select 1 from sys.database_principals where name = @role) 
	begin
		declare @sql_drop_user nvarchar(max);
		set @sql_drop_user = 'drop user [' + @role + ']';
		exec sp_executesql @sql_drop_user;
	end

	declare @sql_create_login nvarchar(max);
	set @sql_create_login = 'create login [' + @role + '] with password = ''' + @role_password + '''';
	exec sp_executesql @sql_create_login;

	declare @sql_create_user nvarchar(max);
	set @sql_create_user = 'create user [' + @role + '] for login [' + @role + '] with default_schema = dbo';
	exec sp_executesql @sql_create_user;

	declare @sql_deny_alter nvarchar(max);
	set @sql_deny_alter = 'deny alter on SCHEMA::dbo to [' + @role + ']';
	exec sp_executesql @sql_deny_alter;

	insert into Authorizations([role])
    values (@role);

	if (@@ROWCOUNT = 1) print(@role + ' created');
end
go

dbcc checkident (Authentications, RESEED, 0);
go

execute CreateAuthorization 'NAV_GUEST', 'qT7i2W8pLk9eX3nZvC4dF5oG1rJ6yH9'; 					    
execute CreateAuthorization 'NAV_ADMIN', 'Uj6wV9pLm2Nz8RtY5bX3oF1KvQ4sM7n';					    
execute CreateAuthorization 'NAV_ESP', 'Pz5wK2yL8Qm3vR1Xt6fJ9nTgC4hS7uA';					    
execute CreateAuthorization 'NAV_STUDENT', 'mG4tR1qL7yU9fJ2dZ5nX8cHwP6kV3oB';
