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


if object_id ('ManageCoursesReport','P') is not null drop procedure ManageCoursesReport;
go
CREATE PROCEDURE ManageCoursesReport
AS
BEGIN
    SELECT 
        c.course_name AS 'Tên khóa học',
        COUNT(e.enrollment_id) AS 'Số người tham gia',
        (COUNT(e.enrollment_id) * c.course_price) AS 'Tổng doanh thu'
    FROM 
        dbo.Courses c
    LEFT JOIN 
        dbo.Enrollments e ON c.course_id = e.course_id
    LEFT JOIN 
        dbo.Accomplishments a ON e.enrollment_id = a.enrollment_id
    GROUP BY 
        c.course_name, c.course_price
END
GO

if object_id ('ManageStudentCoursesReport','P') is not null drop procedure ManageStudentCoursesReport;
go
CREATE PROCEDURE ManageStudentCoursesReport
    @user_id INT
AS
BEGIN
	begin
		select user_full_name
		from Users
		where @user_id=[user_id]
	end
	begin
		SELECT 
			c.course_name AS 'Tên khóa học',
			CASE 
				WHEN a.accomplishment_id IS NOT NULL THEN N'Hoàn thành'
				ELSE N'Chưa hoàn thành'
			END AS 'Trạng thái',
			c.course_price AS 'Doanh thu'
		FROM 
        dbo.Enrollments e
		INNER JOIN 
        dbo.Courses c ON e.course_id = c.course_id
		LEFT JOIN 
        dbo.Accomplishments a ON e.enrollment_id = a.enrollment_id
		WHERE 
			e.user_id = @user_id
	end
END
GO
grant execute on dbo.[ManageCoursesReport] to [NAV_ADMIN];
go
grant execute on dbo.[ManageStudentCoursesReport] to [NAV_ADMIN];
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

