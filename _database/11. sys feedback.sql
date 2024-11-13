use NavCareerDB;

delete from SystemFeedbacks; 
go

dbcc checkident (SystemFeedbacks, RESEED, 0);
go

insert into SystemFeedbacks ([feedback_description], [feedback_date], [user_id])
values
(N'Need more course', getdate(), 2);
go