use NavCareerDB;

delete from SystemFeedbacks; 
go

dbcc checkident (SystemFeedbacks, RESEED, 0);
go

INSERT INTO [dbo].[SystemFeedbacks] (feedback_description, user_id)
VALUES 
    (N'Hệ thống hoạt động rất tốt', 1),
    (N'Giao diện thân thiện và dễ sử dụng', 2),
    (N'Cần cải thiện tốc độ xử lý', 3),
    (N'Hỗ trợ người dùng nhanh chóng và hiệu quả', 4),
    (N'Tính năng tìm kiếm cần bổ sung', NULL),
    (N'Lỗi hiển thị trên trang chủ', NULL),
    (N'Thêm tính năng đăng ký nhanh', NULL);
go

if object_id('createFeedback', 'P') is not null drop procedure createFeedback;
go

create procedure createFeedback @aid int = null, @description nvarchar(max)
as
	begin
		insert into SystemFeedbacks ([feedback_description], [user_id])
		values (@description , @aid)
	end;
go
--exec createFeedback @aid=null, @decription='i love u'

if object_id ('readFeedback','P') is not null drop procedure readFeedback;
go
CREATE PROCEDURE readfeedback 
AS
BEGIN
    SELECT 
        u.user_full_name, 
        s.feedback_description, 
        s.feedback_date
    FROM 
        SystemFeedbacks s
    LEFT JOIN 
        Users u ON s.user_id = u.user_id;  -- So sánh đúng khóa ngoại user_id với user_id
END;
GO

--exec readFeedback
-------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------

delete from CourseFeedbacks; 
go

dbcc checkident (CourseFeedbacks, RESEED, 0);
go

INSERT INTO [dbo].CourseFeedbacks (feedback_description,[enrollment_id])
VALUES 
    (N'Khóa học hay dễ hiểu bổ ích', 1),
    (N'Rất hay và lý thú', 2),
    (N'Khóa học dở vcl', 3),
    (N'Hỗ trợ học viên nhanh chóng và hiệu quả', 4),
    (N'Giao diện xấu quá sửa lại dùm cái', 5),
    (N'hình ảnh khóa nhạt nhẽo quá đi ', 6),
    (N'Thêm vài tiện ích hay gì đi cho nó sinh động', 7),
    (N'Giảng viên rất am hiểu về chủ đề, giải đáp thắc mắc rõ ràng.', 9),
    (N'Khóa học có tính ứng dụng cao, phù hợp cho người mới bắt đầu.', 8),
    (N'Thời lượng mỗi buổi học hợp lý, không quá dài cũng không quá ngắn.', NULL),
    (N'Giảng viên nên sử dụng thêm ví dụ thực tế để dễ hiểu hơn.', 13),
    (N'Tôi đánh giá cao chất lượng dịch vụ hỗ trợ học viên.', 14),
    (N'Khóa học cung cấp đầy đủ tài liệu tham khảo chất lượng.', 15),
    (N'Nội dung khóa học hơi lặp lại ở một số phần, nhưng nhìn chung vẫn tốt.', 16),
    (N'Tôi thích cách giảng viên sử dụng các bài tập thực hành.', NULL),
    (N'Khóa học giúp tôi cải thiện kỹ năng nhanh chóng.', 17),
    (N'Rất hữu ích, cảm ơn đội ngũ hỗ trợ!', 18),
    (N'Khóa học rất hữu ích và giảng viên nhiệt tình.',  19),
    (N'Nội dung bài giảng chi tiết, dễ hiểu. Sẽ giới thiệu bạn bè tham gia.', 20),
    (N'Thời lượng khóa học hơi dài nhưng thông tin cung cấp rất hữu ích.', 21),
    (N'Khóa học tuyệt vời! Thực hành sát với thực tế.',  24),
    (N'Cần cải thiện phần tài liệu học tập.', 23),
    (N'Giáo trình đầy đủ, giảng viên hỗ trợ tận tâm.',  23),
    (N'Khóa học đạt kỳ vọng, sẽ tham gia thêm khóa khác.',  27),
    (N'Hài lòng với chất lượng giảng dạy.',  25),
    (N'Tuyệt vời! Đã học được rất nhiều điều mới.',  25),
    (N'Khóa học ổn, nhưng thời gian học hơi ngắn.',  25);
go
-- Verify the inserted data
--SELECT * FROM [dbo].[CourseFeedbacks];
if object_id ('readFeedbackCourse','P') is not null drop procedure readFeedbackCourse;
go
create proc readFeedbackCourse @courseId int
as
	begin
	SELECT 
		u.user_full_name,
        c.course_id,
        cf.feedback_description,
		cf.feedback_date
    FROM 
        CourseFeedbacks cf
    INNER JOIN 
        Enrollments e ON cf.enrollment_id = e.enrollment_id
    INNER JOIN 
        Courses c ON e.course_id = c.course_id
	INNER JOIN 
        Users u ON e.[user_id] = u.[user_id]
    WHERE 
        c.course_id = @courseID
    ORDER BY 
        cf.feedback_date DESC;
	end;
go

-- exec readFeedbackCourse @courseId=10

if object_id ('createFeedbackCourse','P') is not null drop proc createFeedbackCourse;
go
CREATE PROCEDURE createFeedbackCourse
    @userId INT,
    @courseId INT,
    @description NVARCHAR(MAX)
AS
BEGIN
    -- Bắt đầu transaction
    BEGIN TRANSACTION;

    -- Kiểm tra xem user đã enroll vào khóa học chưa
    IF EXISTS (
        SELECT 1
        FROM Enrollments e
        INNER JOIN Users u ON e.[user_id] = u.[user_id]
        WHERE u.[user_id] = @userId AND e.course_id = @courseId
    )
    BEGIN
        -- Thêm phản hồi vào bảng CourseFeedbacks
        INSERT INTO CourseFeedbacks (feedback_description, enrollment_id)
        SELECT 
            @description, 
            e.enrollment_id
        FROM 
            Enrollments e
        WHERE 
            e.[user_id] = @userId AND e.course_id = @courseId;

        -- Trả thông báo thay vì PRINT
        SELECT N'Cảm ơn vì góp ý của bạn' AS Message;

        -- Commit transaction nếu thành công
        COMMIT TRANSACTION;
    END
    ELSE
    BEGIN
        -- Trả thông báo thay vì PRINT
        SELECT N'Bạn chưa tham gia khóa học Này' AS Message;

        -- Rollback transaction nếu user không có enrollment
        ROLLBACK TRANSACTION;
    END
END;
go
--EXEC createFeedbackCourse @userId = 1, @courseId =1, @description= N'bzcvbzcvbzkdfkjdkfjvafvkafvbz';



grant execute on dbo.[createFeedback] to [NAV_GUEST];
go					 
grant execute on dbo.[createFeedback] to [NAV_ESP];
go					 
grant execute on dbo.[createFeedback] to [NAV_STUDENT];
go
grant execute on dbo.[createFeedback] to [NAV_ADMIN];
go
------------------------------------------------------
grant execute on dbo.[readfeedback] to [NAV_ADMIN];
go
------------------------------------------------------
grant execute on dbo.[createFeedbackCourse] to [NAV_ESP];
go					  
grant execute on dbo.[createFeedbackCourse] to [NAV_STUDENT];
go					  
grant execute on dbo.[createFeedbackCourse] to [NAV_ADMIN];
------------------------------------------------------
grant execute on dbo.[readFeedbackCourse] to [NAV_ESP];
