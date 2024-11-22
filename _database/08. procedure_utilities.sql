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
    @user_id INT
AS
BEGIN
    -- Hiển thị danh sách khóa học mà user đã enroll cùng số người tham gia mỗi khóa
    SELECT 
        c.course_id,
        c.course_name AS [CourseName],
        CASE 
            WHEN e.enrollment_is_complete = 1 THEN N'Hoàn thành'
            ELSE N'Chưa hoàn thành'
        END AS [Status],
        c.course_price AS [CoursePrice],
        (SELECT COUNT(*) 
         FROM dbo.Enrollments e2 
         WHERE e2.course_id = c.course_id) AS [NumberOfParticipants] -- Đếm số người tham gia
    FROM 
        dbo.Enrollments e
    INNER JOIN 
        dbo.Courses c ON e.course_id = c.course_id
    WHERE 
        e.user_id = @user_id;
END;
GO



--exec ManageCoursesReport @user_id=1
if object_id ('GetUsersEnrolledInCourse','P') is not null drop procedure GetUsersEnrolledInCourse;
go
CREATE PROCEDURE GetUsersEnrolledInCourse
    @course_id INT
AS
BEGIN
    -- Hiển thị danh sách người dùng đã enroll vào khóa học
    SELECT 
        u.user_full_name AS [StudentName],
        u.user_email AS [Email],
        CASE 
            WHEN e.enrollment_is_complete = 1 THEN N'Hoàn thành'
            ELSE N'Chưa hoàn thành'
        END AS [Status]
    FROM 
        dbo.Enrollments e
    INNER JOIN 
        dbo.Users u ON e.user_id = u.user_id
    WHERE 
        e.course_id = @course_id;
END;
GO
--exec GetUsersEnrolledInCourse @course_id = 3


			

grant execute on dbo.[Search] to [NAV_GUEST];
go
grant execute on dbo.[Search] to [NAV_ADMIN];
go
grant execute on dbo.[Search] to [NAV_ESP];
go
grant execute on dbo.[Search] to [NAV_STUDENT];
go

grant execute on dbo.[ManageCoursesReport] to [NAV_ESP];
go		

grant execute on dbo.[GetUsersEnrolledInCourse] to [NAV_ESP];
go		
--exec Search N'Th'

