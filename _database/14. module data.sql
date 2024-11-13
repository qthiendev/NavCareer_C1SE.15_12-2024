use NavCareerDB;

delete from Modules;		 
go

dbcc checkident (AuthProcedureBanned, RESEED, 0);
go

insert into Modules ([module_name], [module_created_date], [module_ordinal], [course_id])
values
(N'Giới thiệu tổng quan và cài đặt môi trường.', getdate(), 0, 0),
(N'Cú pháp và câu lệnh cơ bản.', getdate(), 1, 0);
go