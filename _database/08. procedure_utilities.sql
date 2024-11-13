USE [NavCareerDB]
go

if object_id('Search', 'P') is not null drop procedure Search;
go

create procedure Search @index nvarchar(512)
as
begin
    set nocount on;
    
    declare @normalizedindex nvarchar(512);
    set @normalizedindex = lower(@index) collate sql_latin1_general_cp1_ci_ai;

    print(@normalizedindex)

    select distinct 
        [user_id] as [id], 
        [user_full_name] as [name],
		[user_bio] as [description],
        1 as [is_user]
    from Users
    where (lower([user_full_name]) collate sql_latin1_general_cp1_ci_ai like '%' + @normalizedindex + '%'
		or lower([user_alias]) collate sql_latin1_general_cp1_ci_ai like '%' + @normalizedindex + '%')
		and [user_status] = 1

    union all

    select distinct 
        [course_id] as [id], 
        [course_name] as [name],
		[course_short_description] as [description],
        0 as [is_user]
    from Courses
    where lower([course_name]) collate sql_latin1_general_cp1_ci_ai like '%' + @normalizedindex + '%'
		and [course_status] = 1;

    set nocount off;
end
go

grant execute on dbo.[Search] to [NAV_GUEST];
go
grant execute on dbo.[Search] to [NAV_ADMIN];
go
grant execute on dbo.[Search] to [NAV_ESP];
go
grant execute on dbo.[Search] to [NAV_STUDENT];
go

--exec Search N'Th'

