use NavCareerDB;

delete from Authentications;	 
go

dbcc checkident (Authentications, RESEED, 0);
go

if object_id('CreateAuthentication', 'P') is not null drop procedure CreateAuthentication;
go
create procedure CreateAuthentication @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int, @auth_status bit
as
begin
    declare @authentication_id int;
	declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
	declare @encoded_identifier_email varbinary(max);

	set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
	set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);
    
    insert into Authentications([account], [password], [identifier_email], [created_date], [authorization_id], [auth_status])
    values (@encoded_account, @encoded_password, @encoded_identifier_email, getdate(), @authorization_id, @auth_status);
end
go

execute CreateAuthentication 'nav_admin', 'nav_admin', 'nav_admin@gmail.com', 1, 1;         
execute CreateAuthentication 'nav_esp', 'nav_esp', 'nav_esp@gmail.com', 2, 1;
execute CreateAuthentication 'nav_student', 'nav_student', 'nav_student@gmail.com', 3, 1;
execute CreateAuthentication 'qthiendev', 'qthiendev', 'trinhquythien.dev@gmail.com', 1, 1;
execute CreateAuthentication 'KeyPhan', '123456', 'mynameispro164@gmail.com', 1, 1;
execute CreateAuthentication 'phvbarca', '123456', 'phamhavy9b@gmail.com', 1, 1;
EXECUTE CreateAuthentication 'hoangphuc', 'hoangphuc', 'hoangphuc109@example.net', 2, 1;
EXECUTE CreateAuthentication 'gabriel30', ')y10OuKx31', 'rbaker@example.com', 3, 1;


--execute SignUp 'nav_admin', 'nav_admin', 'nav_admin@gmail.com', 1;         