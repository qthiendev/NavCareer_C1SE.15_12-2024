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
	declare @is_active bit;
	select @is_active = [is_active]
	from Authentications
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @password;

	if (@is_active = 0)
		return;

	select auth.[authentication_id], authz.[role]
	from Authentications auth join Authorizations authz on authz.authorization_id = auth.authorization_id
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', auth.[account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', auth.[password])) = @password;
end
go
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

    select @authentication_id = isnull(max(authentication_id), -1) + 1 from Authentications;
	set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
	set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);
    
    insert into Authentications([authentication_id], [account], [password], [identifier_email], [created_date], [authorization_id], [is_active])
    values (@authentication_id, @encoded_account, @encoded_password, @encoded_identifier_email, getdate(), @authorization_id, 1);

	select 'TRUE' as [check]
	from Authentications
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @password
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [identifier_email])) = @identifier_email
		and [authorization_id] = @authorization_id;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('UpdateAuth', 'P') is not null drop procedure UpdateAuth;
go
create procedure UpdateAuth
	@aid int, 
	@new_account nvarchar(max),
	@current_password nvarchar(max), 
	@new_password nvarchar(max), 
	@new_identifier_email nvarchar(max), 
	@new_authorization_id int
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateAuth');
    if @IsBanned = 1 return;

	declare @encoded_new_account varbinary(max);
    declare @encoded_new_password varbinary(max);
	declare @encoded_new_identifier_email varbinary(max);

	set @encoded_new_account = EncryptByPassPhrase('NavCareerSecret', @new_account);
    set @encoded_new_password = EncryptByPassPhrase('NavCareerSecret', @new_password);
	set @encoded_new_identifier_email = EncryptByPassPhrase('NavCareerSecret', @new_identifier_email);

	update Authentications
	set [account] = @encoded_new_account,
		[password] = @encoded_new_password,
		[identifier_email] = @encoded_new_identifier_email
	where [authentication_id] = @aid
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @current_password

	select 'TRUE' as [check]
	from Authentications
	where [authentication_id] = @aid
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @new_account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @new_password
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [identifier_email])) = @new_identifier_email
		and [authorization_id] = @new_authorization_id;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('SetAuthState', 'P') is not null drop procedure SetAuthState; 
go
create procedure SetAuthState @aid int, @password nvarchar(max), @is_active bit
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'SetAuthState');
    if @IsBanned = 1 return;

	update Authentications
	set [is_active] = @is_active
	where [authentication_id] = @aid
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @password;

	select 'TRUE' as [check]
	from Authentications
	where [authentication_id] = @aid
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @password
		and [is_active] = @is_active;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ResetPassword', 'P') is not null drop procedure ResetPassword; 
go
create procedure ResetPassword @account nvarchar(max), @new_password nvarchar(max), @identifier_email nvarchar(max)
as
begin
	update Authentications
	set [password] = EncryptByPassPhrase('NavCareerSecret', @new_password)
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [identifier_email])) = @identifier_email;

	select 'TRUE' as [check]
	from Authentications
	where convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [account])) = @account
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [password])) = @new_password
		and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', [identifier_email])) = @identifier_email;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

-- grant procedure
grant execute on dbo.SignIn to [NAV_GUEST];
go
grant execute on dbo.SignIn to [NAV_ADMIN];
go
grant execute on dbo.SignIn to [NAV_ESP];
go
grant execute on dbo.SignIn to [NAV_STUDENT];
go
grant execute on dbo.SignUp to [NAV_GUEST];
go

grant execute on dbo.UpdateAuth to [NAV_ADMIN];
go
grant execute on dbo.UpdateAuth to [NAV_ESP];
go
grant execute on dbo.UpdateAuth to [NAV_STUDENT];
go

grant execute on dbo.SetAuthState to [NAV_ADMIN];
go
grant execute on dbo.SetAuthState to [NAV_ESP];
go
grant execute on dbo.SetAuthState to [NAV_STUDENT];
go

grant execute on dbo.ResetPassword to [NAV_GUEST];

-- Test execution as NAV_USER
EXECUTE AS USER = 'NAV_ADMIN';
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
--EXEC dbo.SignUp 'test', 'test', 'test@gmail.com', 1;
--exec SetAuthState 3, 'qthiendev', 1
REVERT;