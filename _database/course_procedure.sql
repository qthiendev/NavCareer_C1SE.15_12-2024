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
	select u.user_full_name,
		u.address,
		u.birthdate,
		u.email,
		u.phone_number,
		c.[course_name], 
		c.[course_description],
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
	@duration nvarchar(max),
	@provider_id nvarchar(max)
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateAuth');
    if @IsBanned = 1 return;

	declare @course_id int;

	select @course_id = isnull(max(course_id), -1) + 1 from Courses;

	insert into Courses ([course_id], [course_name], [course_description], [duration], [created_date], [provider_id])
	values
	(@course_id, @course_name, @course_description, @duration, getdate(), @provider_id);

	select 'TRUE' as [check]
	from Courses
	where [course_id] = @course_id
		and [course_name] = @course_name
		and [course_description] = @course_description
		and [duration] = @duration
		and [provider_id] = @provider_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

grant execute on dbo.ReadCourse to [NAV_GUEST];
grant execute on dbo.ReadCourse to [NAV_ADMIN];
grant execute on dbo.ReadCourse to [NAV_ESP];
grant execute on dbo.ReadCourse to [NAV_STUDENT];

grant execute on dbo.CreateCourse to [NAV_ADMIN];
grant execute on dbo.CreateCourse to [NAV_ESP];