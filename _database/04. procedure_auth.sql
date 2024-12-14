go
use master;
go
use NavCareerDB;
go

if object_id('SignIn', 'P') is not null drop procedure SignIn;
go
create procedure SignIn  @account nvarchar(max), @password nvarchar(max)
as
begin
	declare @auth_status bit = 0;

	select @auth_status = ISNULL([auth_status], 0)
	from Authentications
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @password;

	if (@auth_status = 0)
	begin
		select 'INACTIVE' as [check]
		return;
	end

	select 'ACTIVE' as [check],
		auth.[authentication_id], 
		authz.[role],
		u.[user_id]
	from Authentications auth
		left join Authorizations authz on authz.authorization_id = auth.authorization_id
		left join Users u on u.[authentication_id] = auth.[authentication_id]
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', auth.[account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', auth.[password])) = @password
		and auth.[delete_flag] = 0
		and u.[delete_flag] = 0;
end
go
-- exec SignIn 'test', 'test'
-- exec SignIn 'qthiendev', 'qthiende'
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('SignUp', 'P') is not null drop procedure SignUp;
go
create procedure SignUp @account nvarchar(max), @password nvarchar(max), @identifier_email nvarchar(max), @authorization_id int
as
begin
	declare @authentication_id int;
	declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
	declare @encoded_identifier_email varbinary(max);

	if exists (
		select 1
		from Authentications
		where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		or convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [identifier_email])) = @identifier_email)
	begin
		select 'EXISTED' as [check]
		return;
	end

	set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
	set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);
    
    insert into Authentications([account], [password], [identifier_email], [authorization_id], [auth_status])
    values (@encoded_account, @encoded_password, @encoded_identifier_email, @authorization_id, 1);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check]
		return;
	end

	select 'FAILED' as [check]
end
go
-- exec SignUp 'test', 'test', 'test1@gmail.com', 2
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

-- grant procedure
grant execute on dbo.SignIn to [NAV_GUEST];
go
grant execute on dbo.SignUp to [NAV_GUEST];
go

-- Test execution as NAV_USER
EXECUTE as USER = 'NAV_ADMIN';
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
--EXEC dbo.SignUp 'test', 'test', 'test@gmail.com', 1;
--exec SetAuthState 3, 'qthiendev', 1
REVERT;