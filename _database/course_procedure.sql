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
		join Modules m on m.[course_id] = c.[course_id]
		join Users u on u.[user_id] = c.[provider_id]
	where c.course_id = @course_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------


grant execute on dbo.ReadCourse to [NAV_GUEST];
grant execute on dbo.ReadCourse to [NAV_ADMIN];
grant execute on dbo.ReadCourse to [NAV_ESP];
grant execute on dbo.ReadCourse to [NAV_STUDENT];

exec ReadCourse 0