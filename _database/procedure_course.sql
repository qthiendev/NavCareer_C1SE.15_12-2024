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
	select u.[user_id],
		u.[user_full_name],
		u.[address],
		u.[birthdate],
		u.[email],
		u.phone_number,
		c.[course_name], 
		c.[course_description],
		c.[course_price],
		c.[duration],
		m.[module_name],
		m.[module_ordinal]
	from Courses c
		left join Modules m on m.[course_id] = c.[course_id]
		join Users u on u.[user_id] = c.[provider_id]
	where c.course_id = @course_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateCourse', 'P') is not null drop procedure CreateCourse;
go
create procedure CreateCourse 
	@aid int, 
	@course_name nvarchar(max), 
	@course_description nvarchar(max),
	@course_price int,
	@duration nvarchar(max)
as
begin
    declare @IsBanned BIT;
    set @IsBanned = dbo.IsUserBanned(@aid, 'CreateCourse');
    if @IsBanned = 1 return;

    declare @course_id int;

    select top 1 @course_id = t1.course_id + 1
    from Courses t1
		left join Courses t2 on t1.course_id + 1 = t2.course_id
    where t2.course_id is null
    order by t1.course_id;

    if @course_id is null select @course_id = isnull(max(course_id), 0) + 1 from Courses;

    insert into Courses ([course_id], [course_name], [course_description], [course_price], [duration], [created_date], [provider_id])
    values
    (@course_id, @course_name, @course_description, @course_price, @duration, getdate(), @aid);

    select 'TRUE' as [check]
    from Courses
    where [course_id] = @course_id
        and [course_name] = @course_name
        and [course_description] = @course_description
        and [duration] = @duration
        and [provider_id] = @aid;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateCourse', 'P') is not null drop procedure UpdateCourse;
go
create procedure UpdateCourse @aid int, @course_id int, @new_course_name nvarchar(max), @new_course_description nvarchar(max), @new_duration nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateCourse');
    if @IsBanned = 1 return;

	update Courses
	set [course_name] = @new_course_name,
		[course_description] = @new_course_description,
		[duration] = @new_duration
	where [course_id] = @course_id
		and [provider_id] = @aid

	select 'TRUE' as [check]
	from Courses
	where [course_id] = @course_id
		and [provider_id] = @aid
		and [course_name] = @new_course_name
		and [course_description] = @new_course_description
		and [duration] = @new_duration
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('DeleteCourse', 'P') is not null drop procedure DeleteCourse;
go
create procedure DeleteCourse @aid int, @course_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'DeleteCourse');
    if @IsBanned = 1 return;

	delete from Courses
	where [course_id] = @course_id
		and [provider_id] = @aid

	select 'TRUE' as [check]
	from Courses
	where [course_id] = @course_id;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ViewUserCourses', 'P') is not null drop procedure ViewUserCourses;
go
create procedure ViewUserCourses @aid int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ViewUserCourses');
    if @IsBanned = 1 return;

	select [course_id], [course_name], [course_price], [duration], [created_date]
	from Courses
	where [provider_id] = @aid
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.ReadCourse to [NAV_GUEST];
grant execute on dbo.ReadCourse to [NAV_ADMIN];
grant execute on dbo.ReadCourse to [NAV_ESP];
grant execute on dbo.ReadCourse to [NAV_STUDENT];

grant execute on dbo.CreateCourse to [NAV_ESP];
grant execute on dbo.UpdateCourse to [NAV_ESP];
grant execute on dbo.DeleteCourse to [NAV_ESP];
grant execute on dbo.ViewUserCourses to [NAV_ESP];