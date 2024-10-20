go
use master;
go
use NavCareerDB;
go

if object_id('ReadCourse', 'P') is not null drop procedure ReadCourse;
go
create procedure ReadCourse @course_id int
as
begin
	if not exists (
		select 1
		from Courses
		where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	select u.[user_id],
		u.[authentication_id],
		u.[user_full_name],
		u.[user_address],
		u.[user_birthdate],
		u.[user_email],
		u.[user_phone_number],
		c.[course_name], 
		c.[course_short_description],
		c.[course_full_description],
		c.[course_price],
		c.[course_duration],
		c.[course_piority_index],
		c.[course_status],
		m.[module_ordinal],
		m.[module_name]
	from Courses c
		left join Modules m on m.[course_id] = c.[course_id]
		join Users u on u.[user_id] = c.[user_id]
	where c.course_id = @course_id
	order by m.[module_ordinal];
end
go
-- exec ReadCourse 0
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateCourse', 'P') is not null drop procedure CreateCourse;
go
create procedure CreateCourse 
	@aid int, 
	@course_name nvarchar(max),
	@course_short_description nvarchar(max),
	@course_full_description nvarchar(max),
	@course_price int,
	@course_duration nvarchar(max)
as
begin
    declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ViewUserCourses');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

    declare @course_id int;
	declare @user_id int;

    select top 1 @course_id = t1.course_id + 1
    from Courses t1
		left join Courses t2 on t1.course_id + 1 = t2.course_id
    where t2.course_id is null
    order by t1.course_id;

    if @course_id is null select @course_id = isnull(max(course_id), 0) + 1 from Courses;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check]
		return;
	end

	if not exists (
		select 1
		from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
		where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
	begin
		select 'U_ROLE' as [check]
		return;
	end

	if exists (
		select 1
		from Courses
		where [course_name] = @course_name)
	begin
		select 'EXISTED' as [check]
		return;
	end

	declare @resource_url nvarchar(max) = '/courses/_' + cast(@course_id as nvarchar);

    insert into Courses ([course_id],
		[course_name],
		[course_short_description],
		[course_full_description],
		[course_price],
		[course_duration], 
		[course_created_date],
		[course_resource_url],
		[course_piority_index],
		[course_status],
		[user_id]
	)
    values
    (@course_id, @course_name, @course_short_description, @course_full_description, @course_price, @course_duration, getdate(), @resource_url, 1, 1, @user_id);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- exec CreateCourse 2, 'Test course name', 'Test short decrisption', 'Test full decrisption', 300000, '3 months', 5
-- exec ReadCourse 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateCourse', 'P') is not null drop procedure UpdateCourse;
go
create procedure UpdateCourse 
	@aid int,
	@course_id int,
	@course_name nvarchar(max),
	@course_short_description nvarchar(max),
	@course_full_description nvarchar(max),
	@course_price int,
	@course_duration nvarchar(max),
	@course_status bit
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ViewUserCourses');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check]
		return;
	end

	if not exists (
		select 1
		from Courses
		where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	if not exists (
		select 1
		from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
		where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
	begin
		select 'U_ROLE' as [check]
		return;
	end

	update Courses
	set [course_name] = @course_name,
		[course_short_description] = @course_short_description,
		[course_full_description] = @course_full_description,
		[course_price] = @course_price,
		[course_duration] = @course_duration, 
		[course_status] = @course_status
	where [user_id] = @user_id
		and [course_id] = @course_id
	

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- exec UpdateCourse 1, 2, 'Test course name1', 'Test short decrisption1', 'Test full decrisption1', 300000, '3 months', 1
-- exec ReadCourse 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('DeleteCourse', 'P') is not null drop procedure DeleteCourse;
go
create procedure DeleteCourse @aid int, @course_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ViewUserCourses');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check]
		return;
	end

	if not exists (
		select 1
		from Courses
		where [course_id] = @course_id)
	begin
		select 'U_CID' as [check]
		return;
	end

	if not exists (
		select 1
		from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
		where auth.authentication_id = @aid and authz.role = 'NAV_ESP')
	begin
		select 'U_ROLE' as [check]
		return;
	end

	delete from Courses
	where [course_id] = @course_id
		and [user_id] = @user_id

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end
go
-- exec DeleteCourse 1, 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadUserCourses', 'P') is not null drop procedure ReadUserCourses;
go
create procedure ReadUserCourses @aid int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ViewUserCourses');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid;

	select [course_id],
		[course_name],
		[course_short_description],
		[course_full_description],
		[course_price],
		[course_duration],
		[course_created_date],
		[course_status]
	from Courses
	where [user_id] = @user_id
end
go
-- exec ViewUserCourses 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.ReadCourse to [NAV_GUEST];
grant execute on dbo.ReadCourse to [NAV_ADMIN];
grant execute on dbo.ReadCourse to [NAV_ESP];
grant execute on dbo.ReadCourse to [NAV_STUDENT];

grant execute on dbo.CreateCourse to [NAV_ESP];
grant execute on dbo.UpdateCourse to [NAV_ESP];
grant execute on dbo.DeleteCourse to [NAV_ESP];
grant execute on dbo.ReadUserCourses to [NAV_ESP];