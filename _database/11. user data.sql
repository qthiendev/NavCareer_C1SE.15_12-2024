use NavCareerDB;

delete from Users;			 
go

dbcc checkident (Users, RESEED, 0);
go

insert into Users ([user_full_name], [user_alias], [user_email], [user_birthdate], [user_gender], [user_phone_number], [user_address], [user_created_date], [authentication_id])
values
(N'admin 0', N'adm0', N'admin@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 0),
(N'education service provider 0', N'esp0', N'esp@gmail.com', getdate(), 0, N'0123456789', N'Đà Nẵng', getdate(), 1),
(N'student 0', N'std0', N'student@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 2),
(N'Trịnh Quý Thiện', N'qthiendev', N'trinhquythien.dev@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 3),
(N'Phan Công Khải', N'KhaiKey', N'mynameispro164@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 4),
(N'Phạm Hạ Vỹ', N'phamhavy', N'phamhavy9b@gmail.com', getdate(), 1, N'0123456789', N'Đà Nẵng', getdate(), 5),
(N'Daniel Rodriguez', N'gdavis', N'bevans@example.net', '1992-05-07', 0, N'1488408658', N'328 William Trail, Port Ryan, CT 77141', getdate(),  6);
go

