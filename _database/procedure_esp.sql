use NavCareerDB;

if object_id('ReadAllCourse', 'P') is not null drop procedure ReadAllCourse;
go
create procedure ReadAllCourse @aid int
as
begin

	declare @IsBanned BIT;
    set @IsBanned = dbo.IsUserBanned(@aid, 'CreateProfile');
    if @IsBanned = 1 return;

	select c.[course_id],
		c.[course_name], 
		c.[course_description],
		c.[course_price],
		c.[duration],
		count(m.[module_name]) as [total_module]
	from Courses c
		left join Modules m on m.[course_id] = c.[course_id]
	where [provider_id] = @aid
	group by c.[course_id], c.[course_name], c.[course_description], c.[course_price], c.[duration];
end
go

grant execute on dbo.ReadAllCourse to [NAV_ESP];
go

exec ReadAllCourse 1
