use NavCareerDB;

if object_id('CreateNavQuestion', 'P') is not null drop procedure CreateNavQuestion;
go
create procedure CreateNavQuestion @description nvarchar(max)
as
begin

    declare @question_id int;

    select @question_id = isnull(max(question_id), -1) + 1 from NavQuestions;

    insert into NavQuestions ([question_id], [question_description])
    values (@question_id, @description);
end
go

if object_id('CreateNavAnswer', 'P') is not null drop procedure CreateNavAnswer;
go
create procedure CreateNavAnswer @answer_description nvarchar(max), @question_id int
as
begin

    declare @answer_id int;

    select @answer_id = isnull(max(answer_id), -1) + 1 from NavAnswers;

    insert into NavAnswers([answer_id], [answer_description], [question_id])
    values (@answer_id, @answer_description, @question_id);
end
go

if object_id('CreateAuthorization', 'P') is not null drop procedure CreateAuthorization;
go
create procedure CreateAuthorization @aid int, @role nvarchar(max), @role_password varchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
    if @IsBanned = 1 return;

    declare @authorization_id int;

    select @authorization_id = isnull(max(authorization_id), -1) + 1 from Authorizations;

    insert into Authorizations([authorization_id], [role])
    values (@authorization_id, @role);

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
end
go


if object_id('CreateAuthentication', 'P') is not null drop procedure CreateAuthentication;
go
create procedure CreateAuthentication @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int, @is_active bit
as
begin
    declare @authentication_id int;
	declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
	declare @encoded_identifier_email varbinary(max);

    select @authentication_id = isnull(max(authentication_id), -1) + 1 from Authentications;
	set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
	set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);
    
    insert into Authentications([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id], [is_active])
    values (@authentication_id, @encoded_account, @encoded_password, @encoded_identifier_email, getdate(), @authorization_id, @is_active);
end
go

if object_id('CreateUser', 'P') is not null drop procedure CreateUser;
go
create procedure CreateUser @aid int, @user_full_name nvarchar(max), @birthdate nvarchar(10), @gender bit, @email nvarchar(max), @phone_number nvarchar(max), @address nvarchar(max), @authentication_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateUser');
	if @IsBanned = 1 return;

    declare @user_id int;
	declare @resource_url nvarchar(1000) = '/profiles/_' + CONVERT(nvarchar(10), @user_id);

    select @user_id = isnull(max(user_id), -1) + 1 from Users;

    insert into Users([user_id], [user_full_name], [birthdate], [gender], [email], [phone_number], [address], [date_joined], [resource_url], [authentication_id])
    values (@user_id, @user_full_name, CONVERT(datetime, @birthdate), @gender, @email, @phone_number, @address, getdate(), @resource_url, @authentication_id);
end
go

if object_id('CreateSystemFeedback', 'P') is not null drop procedure CreateSystemFeedback;
go
create procedure CreateSystemFeedback @aid int, @feedback_description nvarchar(max), @user_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateSystemFeedback');
	if @IsBanned = 1 return;

    declare @feedback_id int;

    select @feedback_id = isnull(max(feedback_id), -1) + 1 from SystemFeedbacks;

    insert into SystemFeedbacks([feedback_id], [feedback_description], [feedback_date], [user_id])
    values (@feedback_id, @feedback_description, getdate(), @user_id);
end
go

if object_id('CreateCourse', 'P') is not null drop procedure CreateCourse;
go
create procedure CreateCourse @aid int, @course_name nvarchar(max), @course_description nvarchar(max), @duration nvarchar(max), @provider_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCourse');
	if @IsBanned = 1 return;

    declare @course_id int;

    select @course_id = isnull(max(course_id), -1) + 1 from Courses;

    insert into Courses([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
    values (@course_id, @course_name, @course_description, @duration, getdate(), @provider_id);
end
go

if object_id('CreateModule', 'P') is not null drop procedure CreateModule;
go
create procedure CreateModule @aid int, @module_name nvarchar(max), @module_ordinal int, @course_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateModule');
	if @IsBanned = 1 return;

    declare @module_id int;

    select @module_id = isnull(max(module_id), -1) + 1 from Modules;

    insert into Modules([module_id], [module_name], [created_date], [module_ordinal], [course_id])
    values (@module_id, @module_name, getdate(), @module_ordinal, @course_id);
end
go

if object_id('CreateCollectionType', 'P') is not null drop procedure CreateCollectionType;
go
create procedure CreateCollectionType @aid int, @collection_type_name nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCollectionType');
	if @IsBanned = 1 return;

    declare @collection_type_id int;

    select @collection_type_id = isnull(max(collection_type_id), -1) + 1 from CollectionTypes;

    insert into CollectionTypes([collection_type_id], [collection_type_name])
    values (@collection_type_id, @collection_type_name);
end
go

if object_id('CreateCollection', 'P') is not null drop procedure CreateCollection;
go
create procedure CreateCollection @aid int, @collection_name nvarchar(max), @collection_ordinal int, @collection_type_id int, @module_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCollection');
	if @IsBanned = 1 return;

    declare @collection_id int;

    select @collection_id = isnull(max(collection_id), -1) + 1 from Collections;

    insert into Collections([collection_id], [collection_name], [created_date], [collection_ordinal], [collection_type_id], [module_id])
    values (@collection_id, @collection_name, getdate(), @collection_ordinal, @collection_type_id, @module_id);
end
go

if object_id('CreateQuestionType', 'P') is not null drop procedure CreateQuestionType;
go
create procedure CreateQuestionType @aid int, @type_description nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateQuestionType');
	if @IsBanned = 1 return;

    declare @question_type_id int;

    select @question_type_id = isnull(max(question_type_id), -1) + 1 from QuestionTypes;

    insert into QuestionTypes([question_type_id], [type_description])
    values (@question_type_id, @type_description);
end
go

if object_id('CreateQuestion', 'P') is not null drop procedure CreateQuestion;
go
create procedure CreateQuestion @aid int, @question_description nvarchar(max), @question_type_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateQuestion');
	if @IsBanned = 1 return;

    declare @question_id int;

    select @question_id = isnull(max(question_id), -1) + 1 from Questions;

    insert into Questions([question_id], [question_description], [question_type_id])
    values (@question_id, @question_description, @question_type_id);
end
go

if object_id('CreateAnswer', 'P') is not null drop procedure CreateAnswer;
go
create procedure CreateAnswer @aid int, @answer_description nvarchar(max), @is_right bit, @question_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAnswer');
	if @IsBanned = 1 return;

    declare @answer_id int;

    select @answer_id = isnull(max(answer_id), -1) + 1 from Answers;

    insert into Answers([answer_id], [answer_description], [is_right], [question_id])
    values (@answer_id, @answer_description, @is_right, @question_id);
end
go

if object_id('CreateMaterialType', 'P') is not null drop procedure CreateMaterialType;
go
create procedure CreateMaterialType @aid int, @material_type_name nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateMaterialType');
	if @IsBanned = 1 return;

    declare @material_type_id int;

    select @material_type_id = isnull(max(material_type_id), -1) + 1 from MaterialType;

    insert into MaterialType([material_type_id], [material_type_name])
    values (@material_type_id, @material_type_name);
end
go

if object_id('CreateMaterial', 'P') is not null drop procedure CreateMaterial;
go
create procedure CreateMaterial @aid int, @material_content nvarchar(max), @material_ordinal int, @material_type_id int, @collection_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateMaterial');
	if @IsBanned = 1 return;

    declare @material_id int;

    select @material_id = isnull(max(material_id), -1) + 1 from Materials;

    insert into Materials([material_id], [material_content], [material_ordinal], [material_type_id], [collection_id])
    values (@material_id, @material_content, @material_ordinal, @material_type_id, @collection_id);
end
go

if object_id('CreateEnrollment', 'P') is not null drop procedure CreateEnrollment;
go
create procedure CreateEnrollment @aid int, @nav_student_id int, @course_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateEnrollment');
	if @IsBanned = 1 return;

    declare @enrollment_id int;

    select @enrollment_id = isnull(max(enrollment_id), -1) + 1 from Enrollments;

    insert into Enrollments([enrollment_id], [enrollment_date], [is_complete], [user_id], [course_id])
    values (@enrollment_id, getdate(), 0, @nav_student_id, @course_id);
end
go

if object_id('CreateUserTracking', 'P') is not null drop procedure CreateUserTracking;
go
create procedure CreateUserTracking @aid int, @enrollment_id int, @collection_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateUserTracking');
	if @IsBanned = 1 return;

    declare @tracking_id int;

    select @tracking_id = isnull(max(tracking_id), -1) + 1 from UserTracking;

    insert into UserTracking([tracking_id], [enrollment_id], [collection_id])
    values (@tracking_id, @enrollment_id, @collection_id);
end
go

if object_id('CreateGrade', 'P') is not null drop procedure CreateGrade;
go
create procedure CreateGrade @aid int, @grade_number int, @enrollment_id int, @module_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateGrade');
	if @IsBanned = 1 return;

    declare @grade_id int;

    select @grade_id = isnull(max(grade_id), -1) + 1 from Grades;

    insert into Grades([grade_id], [grade_number], [graded_date], [enrollment_id], [module_id])
    values (@grade_id, @grade_number, getdate(), @enrollment_id, @module_id);
end
go

if object_id('CreateAccomplishment', 'P') is not null drop procedure CreateAccomplishment;
go
create procedure CreateAccomplishment @aid int, @overall_grade int, @certificate_id nvarchar(max), @enrollment_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAccomplishment');
	if @IsBanned = 1 return;

    declare @accomplishment_id int;

    select @accomplishment_id = isnull(max(accomplishment_id), -1) + 1 from Accomplishments;

    insert into Accomplishments([accomplishment_id], [completion_date], [overall_grade], [certificate_id], [enrollment_id])
    values (@accomplishment_id, getdate(), @overall_grade, @certificate_id, @enrollment_id);
end
go

if object_id('CreateCourseFeedback', 'P') is not null drop procedure CreateCourseFeedback;
go
create procedure CreateCourseFeedback @aid int, @feedback_description nvarchar(max), @enrollment_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCourseFeedback');
	if @IsBanned = 1 return;

    declare @feedback_id int;

    select @feedback_id = isnull(max(feedback_id), -1) + 1 from CourseFeedbacks;

    insert into CourseFeedbacks([feedback_id], [feedback_description], [feedback_date], [enrollment_id])
    values (@feedback_id, @feedback_description, getdate(), @enrollment_id);
end
go

if object_id('CreateField', 'P') is not null drop procedure CreateField;
go
create procedure CreateField @aid int, @field_description nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateField');
	if @IsBanned = 1 return;

    declare @field_id int;

    select @field_id = isnull(max(field_id), -1) + 1 from Fields;

    insert into Fields([field_id], [field_description])
    values (@field_id, @field_description);
end
go

if object_id('CreateCourseField', 'P') is not null drop procedure CreateCourseField;
go
create procedure CreateCourseField @aid int, @course_id int, @field_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCourseField');
	if @IsBanned = 1 return;

    declare @course_field_id int;

    select @course_field_id = isnull(max(course_field_id), -1) + 1 from CourseField;

    insert into CourseField([course_field_id], [course_id], [field_id])
    values (@course_field_id, @course_id, @field_id);
end
go