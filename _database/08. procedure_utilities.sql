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
    -- Tạo báo cáo khóa học với số lượng người tham gia
    SELECT 
        c.course_name AS 'Tên khóa học',
        COUNT(e.user_id) AS 'Số người tham gia',
		(COUNT(e.user_id) * c.course_price) AS [Tổng doanh thu]
    FROM 
        Courses c
    LEFT JOIN 
        Enrollments e ON c.course_id = e.course_id
    GROUP BY 
        c.course_id, c.course_name, c.course_price
END;
GO

--exec ManageCoursesReport

if object_id ('ManageStudentCoursesReport','P') is not null drop procedure ManageStudentCoursesReport;
go
CREATE PROCEDURE ManageStudentCoursesReport
    @user_id INT
AS
BEGIN
	begin
		SELECT 
			c.course_name AS 'Tên khóa học',
			CASE 
				WHEN e.enrollment_is_complete = 1 THEN N'Hoàn thành'
				ELSE N'Chưa hoàn thành'
			END AS 'Trạng thái',
			c.course_price AS 'Giá khóa học'
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

--exec ManageStudentCoursesReport @user_id=4
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

