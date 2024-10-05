go
use master;
go
if not exists(select * from sys.databases where name = 'NavCareerDB')
begin
	create database NavCareerDB;
end
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
if object_id('Users', 'U') is not null drop table Users;
if object_id('Authentications', 'U') is not null drop table Authentications;
if object_id('Authorizations', 'U') is not null drop table Authorizations;
if object_id('NavAnswers', 'U') is not null drop table NavAnswers;
if object_id('NavQuestions', 'U') is not null drop table NavQuestions;
go

-- Questions
create table NavQuestions (
    [question_id] int primary key not null,
    [question_description] varbinary(max) not null 
);
go

-- Answers
create table NavAnswers (
    [answer_id] int primary key not null,
    [answer_description] varbinary(max) not null, 
    [question_id] int not null,
    constraint fk_nav_answer_question_id foreign key (question_id) references navquestions(question_id)
);
go

-- Authorizations - role
create table Authorizations (
    [authorization_id] int primary key not null,
    [description] varbinary(max) not null 
);
go

-- Authentications - user private info
create table Authentications (
    [authentication_id] int primary key not null,
    [account] varbinary(1000) not null unique, -- kept as nvarchar
    [password] varbinary(max) not null, 
    [identifier_email] varbinary(1000) not null unique,
    [created_date] datetime default getdate() not null,
    [authorization_id] int not null,
    constraint fk_authentication_authorization_id foreign key (authorization_id) references authorizations(authorization_id)
);
go

-- Users - user public info
create table Users (
    [user_id] int primary key not null,
    [user_full_name] varbinary(max) not null, 
    [birthdate] datetime,
    [gender] bit,
	[email] varbinary(max), 
    [phone_number] varbinary(max),
    [address] varbinary(max), 
    [date_joined] datetime default getdate() not null,
    [resource_url] varbinary(max), 
    [authentication_id] int,
    constraint fk_user_authentication_id foreign key (authentication_id) references authentications(authentication_id)
);
go

-- Feedbacks
create table SystemFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] varbinary(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [user_id] int not null,
    constraint fk_feedback_user_id foreign key (user_id) references users(user_id)
);
go

-- Courses
create table Courses (
    [course_id] int primary key not null,
    [course_name] varbinary(max) not null, 
    [course_description] varbinary(max) not null, 
    [duration] varbinary(max) not null, 
    [created_date] datetime default getdate() not null,
    [provider_id] int not null, -- provider -> add trigger that makes sure user role is ESP
    constraint fk_course_provider_id foreign key (provider_id) references users(user_id)
);
go

-- Modules - Course's modules
create table Modules (
    [module_id] int primary key not null,
    [module_name] varbinary(max) not null, 
    [created_date] datetime default getdate() not null,
    [module_ordinal] int not null,
    [course_id] int,
    constraint fk_module_course_id foreign key (course_id) references courses(course_id)
);
go

-- Collection Types
create table CollectionTypes (
    [collection_type_id] int primary key not null,
    [collection_type_name] varbinary(max) 
);
go

-- Collections - Module's Collections
create table Collections (
    [collection_id] int primary key not null,
    [collection_name] varbinary(max) not null, 
    [created_date] datetime default getdate() not null,
    [collection_ordinal] int not null,
    [collection_type_id] int,
    [module_id] int,
    constraint fk_collection_collection_type_id foreign key (collection_type_id) references collectiontypes(collection_type_id),
    constraint fk_collection_module_id foreign key (module_id) references modules(module_id)
);
go

-- Question Types - type for server render
create table QuestionTypes (
    [question_type_id] int primary key not null,
    [type_description] varbinary(max) not null 
);
go

-- Questions
create table Questions (
    [question_id] int primary key not null,
    [question_description] varbinary(max) not null, 
    [question_type_id] int not null,
    constraint fk_question_question_type_id foreign key (question_type_id) references questiontypes(question_type_id)
);
go

-- Answers
create table Answers (
    [answer_id] int primary key not null,
    [answer_description] varbinary(max) not null, 
    [is_right] bit not null,
    [question_id] int not null,
    constraint fk_answer_question_id foreign key (question_id) references questions(question_id)
);
go

-- Material Types
create table MaterialType (
    [material_type_id] int primary key not null,
    [material_type_name] varbinary(max) not null 
);
go

-- Materials - Collection's materials
create table Materials (
    [material_id] int primary key not null,
    [material_content] varbinary(max), 
    [material_ordinal] int not null,
    [material_type_id] int not null,
    [collection_id] int not null,
    constraint fk_material_material_type_id foreign key (material_type_id) references materialtype(material_type_id),
    constraint fk_material_collection_id foreign key (collection_id) references collections(collection_id)
);
go

-- Enrollments - after student enroll a course
create table Enrollments (
    [enrollment_id] int primary key not null,
    [enrollment_date] datetime default getdate() not null,
    [is_complete] bit default 0 not null,
    [student_id] int not null,
    [course_id] int not null,
    constraint fk_enrollment_student_id foreign key (student_id) references users(user_id),
    constraint fk_enrollment_course_id foreign key (course_id) references courses(course_id)
);
go

-- Tracking - enrollment tracking
create table UserTracking (
    [tracking_id] int primary key not null,
    [enrollment_id] int not null,
    [collection_id] int not null,
    constraint fk_tracking_enrollment_id foreign key (enrollment_id) references enrollments(enrollment_id),
    constraint fk_tracking_collection_id foreign key (collection_id) references collections(collection_id)
);
go

-- Grade
create table Grades (
    [grade_id] int primary key not null,
    [grade_number] int not null,
    [graded_date] datetime default getdate() not null,
    [enrollment_id] int not null,
    [module_id] int not null,
    constraint fk_grade_enrollment_id foreign key (enrollment_id) references enrollments(enrollment_id),
    constraint fk_grade_module_id foreign key (module_id) references modules(module_id)
);
go

-- Accomplishments
create table Accomplishments (
    [accomplishment_id] int primary key not null,
    [completion_date] datetime default getdate() not null,
    [overall_grade] int not null,
    [certificate_id] varbinary(max) not null, 
    [enrollment_id] int not null,
    constraint fk_accomplishment_enrollment_id foreign key (enrollment_id) references enrollments(enrollment_id)
);
go

-- Course Feedbacks
create table CourseFeedbacks (
    [feedback_id] int primary key not null,
    [feedback_description] varbinary(max) not null, 
    [feedback_date] datetime default getdate() not null,
    [enrollment_id] int,
    constraint fk_course_feedback_enrollment_id foreign key (enrollment_id) references enrollments(enrollment_id)
);
go

-- Fields - flagging field for filtering/searching
create table Fields (
    [field_id] int primary key not null,
    [field_description] varbinary(max) not null 
);
go

-- Course Field
create table CourseField (
    [course_field_id] int primary key not null,
    [course_id] int not null,
    [field_id] int not null,
    constraint fk_course_field_course_id foreign key (course_id) references courses(course_id),
    constraint fk_course_field_field_id foreign key (field_id) references fields(field_id)
);
go


-- create procedure

if object_id('CreateNavQuestion', 'P') is not null drop procedure CreateNavQuestion;
go
create procedure CreateNavQuestion
	@secret_key nvarchar(max),
    @description nvarchar(max)
as
begin
    declare @question_id int;
	declare @encoded_description varbinary(max);

    select @question_id = isnull(max(question_id), -1) + 1 from NavQuestions;
    set @encoded_description = EncryptByPassPhrase(@secret_key, @description);

    insert into NavQuestions ([question_id], [question_description])
    values (@question_id, @encoded_description);
end
go

if object_id('CreateNavAnswer', 'P') is not null drop procedure CreateNavAnswer;
go
create procedure CreateNavAnswer
	@secret_key nvarchar(max),
    @answer_description nvarchar(max),
    @question_id int
as
begin
    declare @answer_id int;
	declare @encoded_description varbinary(max);

    select @answer_id = isnull(max(answer_id), -1) + 1 from NavAnswers;
    set @encoded_description = EncryptByPassPhrase(@secret_key, @answer_description);

    insert into NavAnswers([answer_id], [answer_description], [question_id])
    values (@answer_id, @encoded_description, @question_id);
end
go

if object_id('CreateAuthorization', 'P') is not null drop procedure CreateAuthorization;
go
create procedure CreateAuthorization
	@secret_key nvarchar(max),
    @description nvarchar(max)
as
begin
    declare @authorization_id int;
	declare @encoded_description varbinary(max);

    select @authorization_id = isnull(max(authorization_id), -1) + 1 from Authorizations;
    set @encoded_description = EncryptByPassPhrase(@secret_key, @description);

    insert into Authorizations([authorization_id], [description])
    values (@authorization_id, @encoded_description);
end
go

if object_id('CreateAuthentication', 'P') is not null drop procedure CreateAuthentication;
go
create procedure CreateAuthentication
	@secret_key nvarchar(max),
    @account nvarchar(max),
    @password nvarchar(max),
    @identifier_email nvarchar(max),
    @authorization_id int
as
begin
    declare @authentication_id int;
	declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
	declare @encoded_identifier_email varbinary(max);
    declare @existing_email_count int;

    select @authentication_id = isnull(max(authentication_id), -1) + 1 from Authentications;
	set @encoded_account = EncryptByPassPhrase(@secret_key, @account);
    set @encoded_password = EncryptByPassPhrase(@secret_key, @password);
	set @encoded_identifier_email = EncryptByPassPhrase(@secret_key, @identifier_email);
    
    insert into Authentications([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id])
    values (@authentication_id, @encoded_account, @encoded_password, @encoded_identifier_email, getdate(), @authorization_id);
end
go

if object_id('CreateUser', 'P') is not null drop procedure CreateUser;
go
create procedure CreateUser
	@secret_key nvarchar(max),
    @user_full_name nvarchar(max),
    @birthdate nvarchar(10),
    @gender bit,
	@email nvarchar(max),
    @phone_number nvarchar(max),
    @address nvarchar(max),
    @authentication_id int
as
begin
    declare @user_id int;
	declare @encoded_full_name varbinary(max);
    declare @encoded_email varbinary(max);
    declare @encoded_phone_number varbinary(max);
    declare @encoded_address varbinary(max);
    declare @encoded_resource_url varbinary(max);

    select @user_id = isnull(max(user_id), -1) + 1 from Users;
    set @encoded_full_name = EncryptByPassPhrase(@secret_key, @user_full_name);
    set @encoded_email = EncryptByPassPhrase(@secret_key, @email);
    set @encoded_phone_number = EncryptByPassPhrase(@secret_key, @phone_number);
    set @encoded_address = EncryptByPassPhrase(@secret_key, @address);
    set @encoded_resource_url = EncryptByPassPhrase(@secret_key, '/profiles/_' + CONVERT(nvarchar(10), @user_id));

    insert into Users([user_id], [user_full_name], [birthdate], [gender], [email], [phone_number], [address], [date_joined], [resource_url], [authentication_id])
    values (@user_id, @encoded_full_name, CONVERT(datetime, @birthdate), @gender, @encoded_email, @encoded_phone_number, @encoded_address, getdate(), @encoded_resource_url, @authentication_id);
end
go

if object_id('CreateSystemFeedback', 'P') is not null drop procedure CreateSystemFeedback;
go
create procedure CreateSystemFeedback
	@secret_key nvarchar(max),
    @feedback_description nvarchar(max),
    @user_id int
as
begin
    declare @feedback_id int;
	declare @encoded_feedback_description varbinary(max);

    select @feedback_id = isnull(max(feedback_id), -1) + 1 from SystemFeedbacks;
    set @encoded_feedback_description = EncryptByPassPhrase(@secret_key, @feedback_description);

    insert into SystemFeedbacks([feedback_id], [feedback_description], [feedback_date], [user_id])
    values (@feedback_id, @encoded_feedback_description, getdate(), @user_id);
end
go

if object_id('CreateCourse', 'P') is not null drop procedure CreateCourse;
go
create procedure CreateCourse
	@secret_key nvarchar(max),
    @course_name nvarchar(max),
    @course_description nvarchar(max),
    @duration nvarchar(max),
    @provider_id int
as
begin
    declare @course_id int;
	declare @encoded_course_name varbinary(max);
    declare @encoded_course_description varbinary(max);
    declare @encoded_duration varbinary(max);

    select @course_id = isnull(max(course_id), -1) + 1 from Courses;
    set @encoded_course_name = EncryptByPassPhrase(@secret_key, @course_name);
    set @encoded_course_description = EncryptByPassPhrase(@secret_key, @course_description);
    set @encoded_duration = EncryptByPassPhrase(@secret_key, @duration);

    insert into Courses([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
    values (@course_id, @encoded_course_name, @encoded_course_description, @encoded_duration, getdate(), @provider_id);
end
go

if object_id('CreateModule', 'P') is not null drop procedure CreateModule;
go
create procedure CreateModule
	@secret_key nvarchar(max),
    @module_name nvarchar(max),
    @module_ordinal int,
    @course_id int
as
begin
    declare @module_id int;
	declare @encoded_module_name varbinary(max);

    select @module_id = isnull(max(module_id), -1) + 1 from Modules;
    set @encoded_module_name = EncryptByPassPhrase(@secret_key, @module_name);

    insert into Modules([module_id], [module_name], [created_date], [module_ordinal], [course_id])
    values (@module_id, @encoded_module_name, getdate(), @module_ordinal, @course_id);
end
go

if object_id('CreateCollectionType', 'P') is not null drop procedure CreateCollectionType;
go
create procedure CreateCollectionType
	@secret_key nvarchar(max),
    @collection_type_name nvarchar(max)
as
begin
    declare @collection_type_id int;
	declare @encoded_collection_type_name varbinary(max);

    select @collection_type_id = isnull(max(collection_type_id), -1) + 1 from CollectionTypes;
    set @encoded_collection_type_name = EncryptByPassPhrase(@secret_key, @collection_type_name);

    insert into CollectionTypes([collection_type_id], [collection_type_name])
    values (@collection_type_id, @encoded_collection_type_name);
end
go

if object_id('CreateCollection', 'P') is not null drop procedure CreateCollection;
go
create procedure CreateCollection
	@secret_key nvarchar(max),
    @collection_name nvarchar(max),
    @collection_ordinal int,
    @collection_type_id int,
    @module_id int
as
begin
    declare @collection_id int;
	declare @encoded_collection_name varbinary(max);

    select @collection_id = isnull(max(collection_id), -1) + 1 from Collections;
    set @encoded_collection_name = EncryptByPassPhrase(@secret_key, @collection_name);

    insert into Collections([collection_id], [collection_name], [created_date], [collection_ordinal], [collection_type_id], [module_id])
    values (@collection_id, @encoded_collection_name, getdate(), @collection_ordinal, @collection_type_id, @module_id);
end
go

if object_id('CreateQuestionType', 'P') is not null drop procedure CreateQuestionType;
go
create procedure CreateQuestionType
	@secret_key nvarchar(max),
    @type_description nvarchar(max)
as
begin
    declare @question_type_id int;
	declare @encoded_type_description varbinary(max);

    select @question_type_id = isnull(max(question_type_id), -1) + 1 from QuestionTypes;
    set @encoded_type_description = EncryptByPassPhrase(@secret_key, @type_description);

    insert into QuestionTypes([question_type_id], [type_description])
    values (@question_type_id, @encoded_type_description);
end
go

if object_id('CreateQuestion', 'P') is not null drop procedure CreateQuestion;
go
create procedure CreateQuestion
	@secret_key nvarchar(max),
    @question_description nvarchar(max),
    @question_type_id int
as
begin
    declare @question_id int;
	declare @encoded_question_description varbinary(max);

    select @question_id = isnull(max(question_id), -1) + 1 from Questions;
    set @encoded_question_description = EncryptByPassPhrase(@secret_key, @question_description);

    insert into Questions([question_id], [question_description], [question_type_id])
    values (@question_id, @encoded_question_description, @question_type_id);
end
go

if object_id('CreateAnswer', 'P') is not null drop procedure CreateAnswer;
go
create procedure CreateAnswer
	@secret_key nvarchar(max),
    @answer_description nvarchar(max),
    @is_right bit,
    @question_id int
as
begin
    declare @answer_id int;
	declare @encoded_answer_description varbinary(max);

    select @answer_id = isnull(max(answer_id), -1) + 1 from Answers;
    set @encoded_answer_description = EncryptByPassPhrase(@secret_key, @answer_description);

    insert into Answers([answer_id], [answer_description], [is_right], [question_id])
    values (@answer_id, @encoded_answer_description, @is_right, @question_id);
end
go

if object_id('CreateMaterialType', 'P') is not null drop procedure CreateMaterialType;
go
create procedure CreateMaterialType
	@secret_key nvarchar(max),
    @material_type_name nvarchar(max)
as
begin
    declare @material_type_id int;
	declare @encoded_material_type_name varbinary(max);

    select @material_type_id = isnull(max(material_type_id), -1) + 1 from MaterialType;
    set @encoded_material_type_name = EncryptByPassPhrase(@secret_key, @material_type_name);

    insert into MaterialType([material_type_id], [material_type_name])
    values (@material_type_id, @encoded_material_type_name);
end
go

if object_id('CreateMaterial', 'P') is not null drop procedure CreateMaterial;
go
create procedure CreateMaterial
	@secret_key nvarchar(max),
    @material_content nvarchar(max),
    @material_ordinal int,
    @material_type_id int,
    @collection_id int
as
begin
    declare @material_id int;
	declare @encoded_material_content varbinary(max);

    select @material_id = isnull(max(material_id), -1) + 1 from Materials;
    set @encoded_material_content = EncryptByPassPhrase(@secret_key, @material_content);

    insert into Materials([material_id], [material_content], [material_ordinal], [material_type_id], [collection_id])
    values (@material_id, @encoded_material_content, @material_ordinal, @material_type_id, @collection_id);
end
go

if object_id('CreateEnrollment', 'P') is not null drop procedure CreateEnrollment;
go
create procedure CreateEnrollment
	@secret_key nvarchar(max),
    @student_id int,
    @course_id int
as
begin
    declare @enrollment_id int;

    select @enrollment_id = isnull(max(enrollment_id), -1) + 1 from Enrollments;

    insert into Enrollments([enrollment_id], [enrollment_date], [is_complete], [student_id], [course_id])
    values (@enrollment_id, getdate(), 0, @student_id, @course_id);
end
go

if object_id('CreateUserTracking', 'P') is not null drop procedure CreateUserTracking;
go
create procedure CreateUserTracking
	@secret_key nvarchar(max),
    @enrollment_id int,
    @collection_id int
as
begin
    declare @tracking_id int;

    select @tracking_id = isnull(max(tracking_id), -1) + 1 from UserTracking;

    insert into UserTracking([tracking_id], [enrollment_id], [collection_id])
    values (@tracking_id, @enrollment_id, @collection_id);
end
go

if object_id('CreateGrade', 'P') is not null drop procedure CreateGrade;
go
create procedure CreateGrade
	@secret_key nvarchar(max),
    @grade_number int,
    @enrollment_id int,
    @module_id int
as
begin
    declare @grade_id int;

    select @grade_id = isnull(max(grade_id), -1) + 1 from Grades;

    insert into Grades([grade_id], [grade_number], [graded_date], [enrollment_id], [module_id])
    values (@grade_id, @grade_number, getdate(), @enrollment_id, @module_id);
end
go

if object_id('CreateAccomplishment', 'P') is not null drop procedure CreateAccomplishment;
go
create procedure CreateAccomplishment
	@secret_key nvarchar(max),
    @overall_grade int,
    @certificate_id nvarchar(max),
    @enrollment_id int
as
begin
    declare @accomplishment_id int;
	declare @encoded_certificate_id varbinary(max);

    select @accomplishment_id = isnull(max(accomplishment_id), -1) + 1 from Accomplishments;
	set @encoded_certificate_id = EncryptByPassPhrase(@secret_key, @certificate_id);

    insert into Accomplishments([accomplishment_id], [completion_date], [overall_grade], [certificate_id], [enrollment_id])
    values (@accomplishment_id, getdate(), @overall_grade, @encoded_certificate_id, @enrollment_id);
end
go

if object_id('CreateCourseFeedback', 'P') is not null drop procedure CreateCourseFeedback;
go
create procedure CreateCourseFeedback
	@secret_key nvarchar(max),
    @feedback_description nvarchar(max),
    @enrollment_id int
as
begin
    declare @feedback_id int;
	declare @encoded_feedback_description varbinary(max);

    select @feedback_id = isnull(max(feedback_id), -1) + 1 from CourseFeedbacks;
    set @encoded_feedback_description = EncryptByPassPhrase(@secret_key, @feedback_description);

    insert into CourseFeedbacks([feedback_id], [feedback_description], [feedback_date], [enrollment_id])
    values (@feedback_id, @encoded_feedback_description, getdate(), @enrollment_id);
end
go

if object_id('CreateField', 'P') is not null drop procedure CreateField;
go
create procedure CreateField
	@secret_key nvarchar(max),
    @field_description nvarchar(max)
as
begin
    declare @field_id int;
	declare @encoded_field_description varbinary(max);

    select @field_id = isnull(max(field_id), -1) + 1 from Fields;
    set @encoded_field_description = EncryptByPassPhrase(@secret_key, @field_description);

    insert into Fields([field_id], [field_description])
    values (@field_id, @encoded_field_description);
end
go

if object_id('CreateCourseField', 'P') is not null drop procedure CreateCourseField;
go
create procedure CreateCourseField
	@secret_key nvarchar(max),
    @course_id int,
    @field_id int
as
begin
    declare @course_field_id int;

    select @course_field_id = isnull(max(course_field_id), -1) + 1 from CourseField;

    insert into CourseField([course_field_id], [course_id], [field_id])
    values (@course_field_id, @course_id, @field_id);
end
go

-- read procedure

if object_id('ReadNavQuestion', 'P') is not null drop procedure ReadNavQuestion;
go
create procedure ReadNavQuestion 
	@secret_key nvarchar(max), 
	@question_id int
as
begin
	select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [question_description])) as [question_description]
	from NavQuestions
	where [question_id] = @question_id;
end
go


if object_id('ReadNavAnswer', 'P') is not null drop procedure ReadNavAnswer;
go
create procedure ReadNavAnswer 
	@secret_key nvarchar(max), 
	@answer_id int
as
begin
	select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [answer_description])) as [answer_description],
		   [question_id]
	from NavAnswers
	where [answer_id] = @answer_id;
end
go

if object_id('ReadAuthorization', 'P') is not null drop procedure ReadAuthorization;
go
create procedure ReadAuthorization 
	@secret_key nvarchar(max),
	@authorization_id int
as
begin
	select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [description])) as [description]
	from Authorizations
	where [authorization_id] = @authorization_id;
end
go

if object_id('ReadAuthentication', 'P') is not null drop procedure ReadAuthentication;
go
create procedure ReadAuthentication 
	@secret_key nvarchar(max), 
	@authentication_id int
as
begin
	select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [account])) as [account],
	convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [password])) as [password],
	convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [identifier_email])) as [identifier_email],
	[authorization_id]
	from Authentications
	where [authentication_id] = @authentication_id;
end
go

if object_id('ReadUser', 'P') is not null drop procedure ReadUser;
go
create procedure ReadUser 
	@secret_key nvarchar(max), 
	@user_id int
as
begin
	select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [user_full_name])) as user_full_name,
		birthdate,
		gender,
		convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [email])) as [email],
		convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [phone_number])) as [phone_number],
		convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [address])) as [address],
		date_joined,
		convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [resource_url])) as [resource_url],
		[authentication_id]
	from Users
	where [user_id] = @user_id;
end
go


if object_id('ReadSystemFeedback', 'P') is not null drop procedure ReadSystemFeedback;
go
create procedure ReadSystemFeedback 
	@secret_key nvarchar(max), 
	@feedback_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [feedback_description])) as [feedback_description],
           [feedback_date], 
           [user_id]
    from SystemFeedbacks
    where [feedback_id] = @feedback_id;
end
go


if object_id('ReadCourse', 'P') is not null drop procedure ReadCourse;
go
create procedure ReadCourse 
	@secret_key nvarchar(max), 
	@course_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [course_name])) as [course_name],
           convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [course_description])) as [course_description],
           convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [duration])) as [duration],
           [created_date], 
           [provider_id]
    from Courses
    where [course_id] = @course_id;
end
go

if object_id('ReadModule', 'P') is not null drop procedure ReadModule;
go
create procedure ReadModule 
	@secret_key nvarchar(max), 
	@module_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [module_name])) as [module_name],
           [created_date], 
           [module_ordinal],
           [course_id]
    from Modules
    where [module_id] = @module_id;
end
go

if object_id('ReadCollectionType', 'P') is not null drop procedure ReadCollectionType;
go
create procedure ReadCollectionType 
	@secret_key nvarchar(max), 
	@collection_type_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [collection_type_name])) as [collection_type_name]
    from CollectionTypes
    where [collection_type_id] = @collection_type_id;
end
go

if object_id('ReadCollection', 'P') is not null drop procedure ReadCollection;
go
create procedure ReadCollection @secret_key nvarchar(max), @collection_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [collection_name])) as [collection_name],
           [created_date], 
           [collection_ordinal],
           [collection_type_id], 
           [module_id]
    from Collections
    where [collection_id] = @collection_id;
end
go

if object_id('ReadQuestionType', 'P') is not null drop procedure ReadQuestionType;
go
create procedure ReadQuestionType @secret_key nvarchar(max), @question_type_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [type_description])) as [type_description]
    from QuestionTypes
    where [question_type_id] = @question_type_id;
end
go

if object_id('ReadQuestion', 'P') is not null drop procedure ReadQuestion;
go
create procedure ReadQuestion @secret_key nvarchar(max), @question_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [question_description])) as [question_description],
           [question_type_id]
    from Questions
    where [question_id] = @question_id;
end
go

if object_id('ReadAnswer', 'P') is not null drop procedure ReadAnswer;
go
create procedure ReadAnswer @secret_key nvarchar(max), @answer_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [answer_description])) as [answer_description],
           [is_right],
           [question_id]
    from Answers
    where [answer_id] = @answer_id;
end
go

if object_id('ReadMaterialType', 'P') is not null drop procedure ReadMaterialType;
go
create procedure ReadMaterialType @secret_key nvarchar(max), @material_type_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [material_type_name])) as [material_type_name]
    from MaterialType
    where [material_type_id] = @material_type_id;
end
go

if object_id('ReadMaterial', 'P') is not null drop procedure ReadMaterial;
go
create procedure ReadMaterial @secret_key nvarchar(max), @material_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [material_content])) as [material_content],
           [material_ordinal], 
           [material_type_id],
           [collection_id]
    from Materials
    where [material_id] = @material_id;
end
go

if object_id('ReadEnrollment', 'P') is not null drop procedure ReadEnrollment;
go
create procedure ReadEnrollment @enrollment_id int
as
begin
    select [enrollment_date], 
           [is_complete], 
           [student_id], 
           [course_id]
    from Enrollments
    where [enrollment_id] = @enrollment_id;
end
go

if object_id('ReadTracking', 'P') is not null drop procedure ReadTracking;
go
create procedure ReadTracking @tracking_id int
as
begin
    select [enrollment_id], 
           [collection_id]
    from UserTracking
    where [tracking_id] = @tracking_id;
end
go

if object_id('ReadGrade', 'P') is not null drop procedure ReadGrade;
go
create procedure ReadGrade @grade_id int
as
begin
    select [grade_number], 
           [graded_date], 
           [enrollment_id], 
           [module_id]
    from Grades
    where [grade_id] = @grade_id;
end
go

if object_id('ReadAccomplishment', 'P') is not null drop procedure ReadAccomplishment;
go
create procedure ReadAccomplishment @secret_key nvarchar(max), @accomplishment_id int
as
begin
    select [completion_date], 
           [overall_grade], 
           convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [certificate_id])) as [certificate_id], 
           [enrollment_id]
    from Accomplishments
    where [accomplishment_id] = @accomplishment_id;
end
go

if object_id('ReadCourseFeedback', 'P') is not null drop procedure ReadCourseFeedback;
go
create procedure ReadCourseFeedback @secret_key nvarchar(max), @feedback_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [feedback_description])) as [feedback_description],
           [feedback_date], 
           [enrollment_id]
    from CourseFeedbacks
    where [feedback_id] = @feedback_id;
end
go

if object_id('ReadField', 'P') is not null drop procedure ReadField;
go
create procedure ReadField @secret_key nvarchar(max), @field_id int
as
begin
    select convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [field_description])) as [field_description]
    from Fields
    where [field_id] = @field_id;
end
go

if object_id('ReadCourseField', 'P') is not null drop procedure ReadCourseField;
go
create procedure ReadCourseField @course_field_id int
as
begin
    select [course_id], 
           [field_id]
    from CourseField
    where [course_field_id] = @course_field_id;
end
go



if object_id('UpdateNavQuestion', 'P') is not null drop procedure UpdateNavQuestion;
go
create procedure UpdateNavQuestion
    @secret_key nvarchar(max),
    @question_id int,
    @new_question_description nvarchar(max)
as
begin
    update NavQuestions
    set [question_description] = EncryptByPassPhrase(@secret_key, @new_question_description)
    where [question_id] = @question_id;
end
go

if object_id('UpdateNavAnswer', 'P') is not null drop procedure UpdateNavAnswer;
go
create procedure UpdateNavAnswer
    @secret_key nvarchar(max),
    @answer_id int,
    @new_answer_description nvarchar(max),
	@new_question_id int
as
begin
    update NavAnswers
    set [answer_description] = EncryptByPassPhrase(@secret_key, @new_answer_description),
		[question_id] = @new_question_id
    where [answer_id] = @answer_id;
end
go

if object_id('UpdateAuthorization', 'P') is not null drop procedure UpdateAuthorization;
go
create procedure UpdateAuthorization
    @secret_key nvarchar(max),
    @authorization_id int,
    @new_description nvarchar(max)
as
begin
    update Authorizations
    set [description] = EncryptByPassPhrase(@secret_key, @new_description)
    where [authorization_id] = @authorization_id;
end
go


if object_id('UpdateAuthentication', 'P') is not null drop procedure UpdateAuthentication;
go
create procedure UpdateAuthentication
	@secret_key nvarchar(max),
	@authentication_id int,
	@new_account nvarchar(max),
	@current_password nvarchar(max),
	@new_password nvarchar(max),
	@new_identifier_email nvarchar(max),
	@new_created_date nvarchar(10),
	@new_authorization_id int
as
begin	
	update Authentications
	set [account] = EncryptByPassPhrase(@secret_key, @new_account),
		[password] = EncryptByPassPhrase(@secret_key, @new_password),
		[identifier_email] = EncryptByPassPhrase(@secret_key, @new_identifier_email),
		[created_date] = convert(datetime, @new_created_date),
		[authorization_id] = @new_authorization_id
	where [authentication_id] = @authentication_id
		and DecryptByPassPhrase(@secret_key, [password]) = @current_password;
end
go

if object_id('UpdateUser', 'P') is not null drop procedure UpdateUser;
go
create procedure UpdateUser
    @secret_key nvarchar(max),
    @user_id int,
    @new_user_full_name nvarchar(max),
    @new_birthdate nvarchar(10),
    @new_gender bit,
    @new_email nvarchar(max),
    @new_phone_number nvarchar(max),
    @new_address nvarchar(max),
    @new_authentication_id int
as
begin
    update Users
    set [user_full_name] = EncryptByPassPhrase(@secret_key, @new_user_full_name),
        [birthdate] = convert(datetime, @new_birthdate),
        [gender] = @new_gender,
        [email] = EncryptByPassPhrase(@secret_key, @new_email),
        [phone_number] = EncryptByPassPhrase(@secret_key, @new_phone_number),
        [address] = EncryptByPassPhrase(@secret_key, @new_address),
        [authentication_id] = @new_authentication_id
    where [user_id] = @user_id;
end
go

if object_id('UpdateSystemFeedback', 'P') is not null drop procedure UpdateSystemFeedback;
if object_id('UpdateCourse', 'P') is not null drop procedure UpdateCourse;
if object_id('UpdateModule', 'P') is not null drop procedure UpdateModule;
if object_id('UpdateCollectionType', 'P') is not null drop procedure UpdateCollectionType;
if object_id('UpdateCollection', 'P') is not null drop procedure UpdateCollectios;
if object_id('UpdateQuestionType', 'P') is not null drop procedure UpdateQuestionType;
if object_id('UpdateQuestion', 'P') is not null drop procedure UpdateQuestion;
if object_id('UpdateAnswers', 'P') is not null drop procedure UpdateAnswer;
if object_id('UpdateMaterialType', 'P') is not null drop procedure UpdateMaterialType;
if object_id('UpdateMaterial', 'P') is not null drop procedure UpdateMaterial;
if object_id('UpdateEnrollment', 'P') is not null drop procedure UpdateEnrollment;
if object_id('UpdateTracking', 'P') is not null drop procedure UpdateTracking;
if object_id('UpdateGrade', 'P') is not null drop procedure UpdateGrade;
if object_id('UpdateAccomplishment', 'P') is not null drop procedure UpdateAccomplishment;
if object_id('UpdateCourseFeedback', 'P') is not null drop procedure UpdateCourseFeedback;
if object_id('UpdateField', 'P') is not null drop procedure UpdateField;
if object_id('UpdateCourseField', 'P') is not null drop procedure UpdateCourseField;

if object_id('DeleteNavQuestion', 'P') is not null drop procedure DeleteNavQuestion;
if object_id('DeleteNavAnswer', 'P') is not null drop procedure DeleteNavAnswer;
if object_id('DeleteAuthorization', 'P') is not null drop procedure DeleteAuthorization;
if object_id('DeleteAuthentication', 'P') is not null drop procedure DeleteAuthentication;
if object_id('DeleteUser', 'P') is not null drop procedure DeleteUser;
if object_id('DeleteSystemFeedback', 'P') is not null drop procedure DeleteSystemFeedback;
if object_id('DeleteCourse', 'P') is not null drop procedure DeleteCourse;
if object_id('DeleteModule', 'P') is not null drop procedure DeleteModule;
if object_id('DeleteCollectionType', 'P') is not null drop procedure DeleteCollectionType;
if object_id('DeleteCollection', 'P') is not null drop procedure DeleteCollectios;
if object_id('DeleteQuestionType', 'P') is not null drop procedure DeleteQuestionType;
if object_id('DeleteQuestion', 'P') is not null drop procedure DeleteQuestion;
if object_id('DeleteAnswers', 'P') is not null drop procedure DeleteAnswer;
if object_id('DeleteMaterialType', 'P') is not null drop procedure DeleteMaterialType;
if object_id('DeleteMaterial', 'P') is not null drop procedure DeleteMaterial;
if object_id('DeleteEnrollment', 'P') is not null drop procedure DeleteEnrollment;
if object_id('DeleteTracking', 'P') is not null drop procedure DeleteTracking;
if object_id('DeleteGrade', 'P') is not null drop procedure DeleteGrade;
if object_id('DeleteAccomplishment', 'P') is not null drop procedure DeleteAccomplishment;
if object_id('DeleteCourseFeedback', 'P') is not null drop procedure DeleteCourseFeedback;
if object_id('DeleteField', 'P') is not null drop procedure DeleteField;
if object_id('DeleteCourseField', 'P') is not null drop procedure DeleteCourseField;


-- Other procedure
if object_id('SignIn', 'P') is not null drop procedure SignIn;
go
create procedure SignIn @secret_key nvarchar(max), @account nvarchar(max), @password nvarchar(max)
as
begin
	select [authentication_id], [authorization_id]
	from Authentications
	where convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase(@secret_key, [password])) = @password;
end
go


--Insert data
execute CreateNavQuestion N'NavCareerSecret', N'Bạn đánh giá thế nào về khả năng viết văn/ làm thơ của mình?';
execute CreateNavQuestion N'NavCareerSecret', N'Bạn đánh giá thế nào về khả năng học một ngôn ngữ mới của mình?';
execute CreateNavQuestion N'NavCareerSecret', N'Bạn thấy khả năng đọc và làm việc với giấy tờ, văn bản, tài liệu của mình như thế nào?';
execute CreateNavQuestion N'NavCareerSecret', N'Hãy đánh giá khả năng dùng lời nói để truyền đạt đến mọi người (Thuyết trình, hướng dẫn, giải thích,...)?';

execute CreateNavAnswer N'NavCareerSecret', N'Rất thấp', 0;
execute CreateNavAnswer N'NavCareerSecret', N'Thấp', 0;
execute CreateNavAnswer N'NavCareerSecret', N'Cao', 0;
execute CreateNavAnswer N'NavCareerSecret', N'Rất cao', 0;
execute CreateNavAnswer N'NavCareerSecret', N'Rất thấp', 1;
execute CreateNavAnswer N'NavCareerSecret', N'Thấp', 1;
execute CreateNavAnswer N'NavCareerSecret', N'Cao', 1;
execute CreateNavAnswer N'NavCareerSecret', N'Rất cao', 1;
execute CreateNavAnswer N'NavCareerSecret', N'Rất thấp', 2;
execute CreateNavAnswer N'NavCareerSecret', N'Thấp', 2;
execute CreateNavAnswer  N'NavCareerSecret', N'Cao', 2;
execute CreateNavAnswer  N'NavCareerSecret', N'Rất cao', 2;
execute CreateNavAnswer  N'NavCareerSecret', N'Rất thấp', 3;
execute CreateNavAnswer  N'NavCareerSecret', N'Thấp', 3;
execute CreateNavAnswer  N'NavCareerSecret', N'Cao', 3;
execute CreateNavAnswer  N'NavCareerSecret', N'Rất cao', 3;

execute CreateAuthorization N'NavCareerSecret', 'ADM';
execute CreateAuthorization N'NavCareerSecret', 'ESP';
execute CreateAuthorization N'NavCareerSecret', 'STU';

execute CreateAuthentication N'NavCareerSecret', 'admin', 'admin', 'admin@gmail.com', 0;
execute CreateAuthentication N'NavCareerSecret', 'esp', 'esp', 'esp@gmail.com', 1;
execute CreateAuthentication N'NavCareerSecret', 'student', 'student', 'student@gmail.com', 2;
execute CreateAuthentication N'NavCareerSecret', 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', 0;

execute CreateUser N'NavCareerSecret', N'admin 0', N'1980-01-01', 1, N'admin@gmail.com', N'0123456789', N'Đà Nẵng', 0;
execute CreateUser N'NavCareerSecret', N'education service provider 0', N'1985-01-01', 0, N'esp@gmail.com', N'0123456789', N'Đà Nẵng', 1;
execute CreateUser N'NavCareerSecret', N'student 0', N'1990-01-01', 1, N'student@gmail.com', N'0123456789', N'Đà Nẵng', 2;
execute CreateUser N'NavCareerSecret', N'Trịnh Quý Thiện', N'2003-12-16', 1, N'trinhquythien.dev@gmail.com', N'0123456789', N'Đà Nẵng', 3;

execute CreateSystemFeedback N'NavCareerSecret', N'Need more course', 2;

execute CreateCourse N'NavCareerSecret', N'Lập trình C/C++', N'Khóa học về lập trình C cơ bản và hướng đối tượng với C++.', N'3 tháng', 1;
execute CreateCourse N'NavCareerSecret', N'Lập trình Python', N'Khóa học về lập trình Python.', N'5 tháng', 1;

execute CreateModule N'NavCareerSecret', N'Lập trình C cơ bản.', 0, 0;
execute CreateModule N'NavCareerSecret', N'Hướng đối tượng và lập trình C++.', 0, 0;
execute CreateModule N'NavCareerSecret', N'Lập trình Python cơ bản.', 0, 1;
execute CreateModule N'NavCareerSecret', N'Tự động hóa với Python.', 1, 1;

execute CreateCollectionType N'NavCareerSecret', N'Lesson';
execute CreateCollectionType N'NavCareerSecret', N'Quiz';
execute CreateCollectionType N'NavCareerSecret', N'Graded Quiz';

execute CreateCollection N'NavCareerSecret', N'Khái niệm lập trình.', 0, 0, 0;
execute CreateCollection N'NavCareerSecret', N'Biến và hằng trong C.', 1, 0, 0;
execute CreateCollection N'NavCareerSecret', N'Input và output.', 2, 0, 0;
execute CreateCollection N'NavCareerSecret', N'Kiểm tra.', 3, 2, 0;

execute CreateCollection N'NavCareerSecret', N'Khái niệm hướng đối tượng.', 0, 0, 1;
execute CreateCollection N'NavCareerSecret', N'Lớp và đối tượng.', 1, 0, 1;
execute CreateCollection N'NavCareerSecret', N'Con trỏ.', 2, 0, 1;
execute CreateCollection N'NavCareerSecret', N'Kiểm tra.', 3, 2, 1;

execute CreateCollection N'NavCareerSecret', N'Khái niệm lập trình.', 0, 0, 2;
execute CreateCollection N'NavCareerSecret', N'Biến và hằng trong Python.', 1, 0, 2;
execute CreateCollection  N'NavCareerSecret', N'Kiểm tra nhanh.', 2, 1, 2;
execute CreateCollection  N'NavCareerSecret', N'Input và output.', 3, 0, 2;
execute CreateCollection  N'NavCareerSecret', N'Kiểm tra.', 4, 2, 2;

execute CreateCollection  N'NavCareerSecret', N'Khái niệm tự động hóa tác vụ.', 0, 0, 3;
execute CreateCollection  N'NavCareerSecret', N'Đọc và xử lý file.', 1, 0, 3;
execute CreateCollection  N'NavCareerSecret', N'Kiểm tra nhanh.', 2, 1, 3;
execute CreateCollection  N'NavCareerSecret', N'Sử dụng máy ảo.', 3, 0, 3;
execute CreateCollection  N'NavCareerSecret', N'Kiểm tra.', 4, 2, 3;

execute CreateQuestionType N'NavCareerSecret', N'Multiple choice'
execute CreateQuestionType N'NavCareerSecret', N'Multiple response';

execute CreateQuestion N'NavCareerSecret', N'Câu lệnh nào dùng để in ra màn hình trong C?', 0;
execute CreateQuestion N'NavCareerSecret', N'Những thành phần nào dưới đây là kiểu dữ liệu trong C?', 1;

execute CreateAnswer N'NavCareerSecret', N'printf()', 1, 0;
execute CreateAnswer N'NavCareerSecret', N'scanf()', 0, 0;
execute CreateAnswer N'NavCareerSecret', N'cout', 0, 0;
execute CreateAnswer N'NavCareerSecret', N'echo', 0, 0;

execute CreateAnswer N'NavCareerSecret', N'int', 1, 1;
execute CreateAnswer N'NavCareerSecret', N'float', 1, 1;
execute CreateAnswer N'NavCareerSecret', N'string', 1, 1;
execute CreateAnswer N'NavCareerSecret', N'object', 0, 1;

execute CreateMaterialType N'NavCareerSecret', 'Text';
execute CreateMaterialType N'NavCareerSecret', 'Image';
execute CreateMaterialType N'NavCareerSecret', 'Video';
execute CreateMaterialType N'NavCareerSecret', 'Question';

execute CreateMaterial N'NavCareerSecret', N'Giới thiệu về lập trình C', 0, 0, 0;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.png', 1, 1, 0;
execute CreateMaterial N'NavCareerSecret', N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 0;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.mp4', 3, 2, 0;

execute CreateMaterial N'NavCareerSecret', N'Biến và hằng trong C.', 0, 0, 1;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.png', 1, 1, 1;
execute CreateMaterial N'NavCareerSecret', N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 1;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.mp4', 3, 2, 1;

execute CreateMaterial N'NavCareerSecret', N'Input và output.', 0, 0, 2;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.png', 1, 1, 2;
execute CreateMaterial N'NavCareerSecret', N'Lập trình C là một trong những ngôn ngữ lập trình lâu đời và phổ biến nhất. Được phát triển vào đầu những năm 1970 bởi Dennis Ritchie tại Bell Labs, ngôn ngữ C đã trở thành nền tảng cho nhiều ngôn ngữ lập trình hiện đại, bao gồm C++, C#, và Java.', 2, 0, 2;
execute CreateMaterial N'NavCareerSecret', N'course/_0/lap_trinh_c.mp4', 3, 2, 2;

execute CreateMaterial N'NavCareerSecret', N'0', 0, 3, 3;
execute CreateMaterial N'NavCareerSecret', N'1', 1, 3, 3;

execute CreateEnrollment N'NavCareerSecret', 2, 0;
execute CreateEnrollment N'NavCareerSecret', 2, 1;

execute CreateUserTracking N'NavCareerSecret', 0, 0;
execute CreateUserTracking N'NavCareerSecret', 0, 1;
execute CreateUserTracking N'NavCareerSecret', 0, 2;
execute CreateUserTracking N'NavCareerSecret', 0, 3;
execute CreateUserTracking N'NavCareerSecret', 1, 4;

execute CreateGrade N'NavCareerSecret', 95, 0, 0;
execute CreateGrade N'NavCareerSecret', 85, 0, 1;

execute CreateAccomplishment N'NavCareerSecret', 90, N'BCCPP010', 0;

execute CreateCourseFeedback N'NavCareerSecret', N'Cảm ơn!', 0;

execute CreateField N'NavCareerSecret', N'Programming';
execute CreateField N'NavCareerSecret', N'C';
execute CreateField N'NavCareerSecret', N'C++';
execute CreateField N'NavCareerSecret', N'Python';
execute CreateField N'NavCareerSecret', N'Automation';
execute CreateField N'NavCareerSecret', N'Object-oriented';
execute CreateField N'NavCareerSecret', N'Virtual machine';

execute CreateCourseField N'NavCareerSecret', 0, 0;
execute CreateCourseField N'NavCareerSecret', 0, 1;
execute CreateCourseField N'NavCareerSecret', 0, 2;
execute CreateCourseField N'NavCareerSecret', 0, 5;
execute CreateCourseField N'NavCareerSecret', 1, 0;
execute CreateCourseField N'NavCareerSecret', 1, 3;
execute CreateCourseField N'NavCareerSecret', 0, 4;
execute CreateCourseField N'NavCareerSecret', 0, 5;
execute CreateCourseField N'NavCareerSecret', 0, 6;