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
grant execute on dbo.[readfeedback] to [NAV_GUEST];
go					 
grant execute on dbo.[readfeedback] to [NAV_ESP];
go					 
grant execute on dbo.[readfeedback] to [NAV_STUDENT];
go
------------------------------------------------------