use NavCareerDB;

delete from AuthProcedureBanned;
go

dbcc checkident (AuthProcedureBanned, RESEED, 0);
go

execute CreateBanned 5, N'UpdateProfile';
execute CreateBanned 5, N'CreateProfile';