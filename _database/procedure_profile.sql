use NavCareerDB;

if object_id('ReadProfile', 'P') is not null drop procedure ReadProfile;
go
create procedure ReadProfile @user_id INT
as
begin
	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0))
	begin
		select 'INACTIVE' as [check];
	end

	select
		[user_full_name], 
		[user_alias],
		[user_bio],
		[user_birthdate],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_resource_url],
		[user_status],
		[authentication_id]
	from Users 
    where [user_id] = @user_id
end
go
-- exec ReadProfile 0
------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
if object_id('ReadProfileSignedIn', 'P') is not null drop procedure ReadProfileSignedIn;
go
create procedure ReadProfileSignedIn @aid int, @user_id INT
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadProfileSignedIn');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0) and @aid != @user_id) 
	begin
		select 'INACTIVE' as [check];
	end

	select
		[user_full_name], 
		[user_alias],
		[user_bio],
		[user_birthdate],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_resource_url],
		[user_status]
	from Users 
    where [user_id] = @user_id;
end;
go
-- exec ReadProfileSignedIn 1, 0
------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
-- CREATE
if object_id('CreateProfile', 'P') is not null drop procedure CreateProfile;
go
create procedure CreateProfile 
	@aid int,
    @user_full_name NVARCHAR(MAX),
    @user_birthdate DATETIME, 
    @user_gender BIT, 
    @user_email NVARCHAR(MAX), 
    @user_phone_number NVARCHAR(30), 
    @user_address NVARCHAR(MAX)
as
begin
	declare @IsBanned BIT;
    set @IsBanned = dbo.IsUserBanned(@aid, 'CreateProfile');
    if @IsBanned = 1 return;

	if not exists (select 1 from Authentications where authentication_id = @aid)
    begin
		select 'U_AID' as [check]
		return;
    end

	if exists (select 1 from Users where authentication_id = @aid)
    begin
		select 'EXISTED' as [check]
		return;
    end

	declare @user_id int;

    select top 1 @user_id = u1.[user_id] + 1
    from Users u1
		left join Users u2 on u1.[user_id] + 1 = u2.[user_id]
    where u2.[user_id] is null
    order by u1.[user_id];

	if @user_id is null select @user_id = isnull(max([user_id]), 0) + 1 from Users;

    declare @resource_url NVARCHAR(MAX) = trim('/profiles/_' + cast(@user_id as NVARCHAR));

    insert into Users ([user_id],
		[user_full_name],
		[user_birthdate],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_resource_url],
		[user_status],
		[authentication_id]
	)
	values(@user_id, @user_full_name, convert(datetime, @user_birthdate, 120),  @user_gender, @user_email,  @user_phone_number, @user_address, GETDATE(), TRIM(@resource_url), 1, @aid);

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];
end;
go
-- EXEC CreateProfile 6, 'Test name', 'TestAlias', '2024-10-20', 1, 'test@gmail.com', '0908777654', 'Da Nang'  
------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
if object_id('UpdateProfile', 'P') is not null drop procedure UpdateProfile;
go
create procedure UpdateProfile 
	@aid int,
    @user_full_name NVARCHAR(MAX),
	@user_alias NVARCHAR(MAX),
	@user_bio NVARCHAR(MAX),
    @user_birthdate DATETIME, 
    @user_gender BIT, 
    @user_email NVARCHAR(MAX), 
    @user_phone_number NVARCHAR(30), 
    @user_address NVARCHAR(MAX),
	@user_status bit
as
begin
    declare @IsBanned BIT;
    set @IsBanned = dbo.IsUserBanned(@aid, 'UpdateProfile');
    if @IsBanned = 1 return;

	if not exists (select 1 from Authentications where authentication_id = @aid)
    begin
		select 'U_AID' as [check]
		return;
    end

	declare @user_id int;

	select @user_id = [user_id]
	from Users
	where [authentication_id] = @aid

	if (@user_id is null)
	begin
		select 'U_UID' as [check]
		return;
	end

	update Users
	set [user_full_name] = @user_full_name, 
		[user_alias] = @user_alias,
		[user_bio] = @user_bio,
		[user_birthdate] = @user_birthdate, 
		[user_gender] = @user_gender, 
		[user_email] = @user_email, 
		[user_phone_number] = @user_phone_number, 
		[user_address] = @user_address,
		[user_status] = @user_status
	where [user_id] = @user_id

	if @@ROWCOUNT = 1
	begin
		select 'SUCCESSED' as [check];
		return;
	end

	select 'FAILED' as [check];

end;
go
-- EXEC UpdateProfile 6, 'Test name', 'TestAlias', '2024-10-20 01:24:25.750', 1, 'test@gmail.com', '0908777654', 'Da Nang', 1
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadProfileByAuth', 'P') is not null drop procedure ReadProfileByAuth;
go
create procedure ReadProfileByAuth @auth_id INT
as
begin
	if (exists (select 1 from Users where [authentication_id] = @auth_id AND [user_status] = 0))
	begin
		select 'INACTIVE' as [check];
	end

	select
		[user_id],
		[user_full_name], 
		[user_alias],
		[user_bio],
		[user_birthdate],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_resource_url],
		[user_status],
		[authentication_id]
	from Users 
    where [authentication_id] = @auth_id 
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadProfileSignedInByAuth', 'P') is not null drop procedure ReadProfileSignedInByAuth;
go
create procedure ReadProfileSignedInByAuth @aid int, @auth_id INT
as
begin
	declare @IsBanned BIT;
	set @IsBanned = dbo.IsUserBanned(@aid, 'ReadProfileSignedInByAuth');
    if @IsBanned = 1 
	begin
		select 'BANNED' as [check];
	end

	if (exists (select 1 from Users where [authentication_id] = @auth_id AND [user_status] = 0))
	begin
		select 'INACTIVE' as [check];
	end

	select
		[user_id],
		[user_full_name], 
		[user_alias],
		[user_bio],
		[user_birthdate],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_resource_url],
		[user_status],
		[authentication_id]
	from Users 
    where [authentication_id] = @auth_id 
end;
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.[ReadProfile] to [NAV_GUEST]                     
go
grant execute on dbo.[ReadProfile] to [NAV_ADMIN]					  
go
grant execute on dbo.[ReadProfile] to [NAV_ESP]						  
go
grant execute on dbo.[ReadProfile] to [NAV_STUDENT]					  
go

grant execute on dbo.[ReadProfileByAuth] to [NAV_ADMIN]				  
go
grant execute on dbo.[ReadProfileByAuth] to [NAV_ESP]				  
go
grant execute on dbo.[ReadProfileByAuth] to [NAV_STUDENT]			  
go
																	  
grant execute on dbo.[ReadProfileSignedIn] to [NAV_ADMIN]			  
go
grant execute on dbo.[ReadProfileSignedIn] to [NAV_ESP]				  
go
grant execute on dbo.[ReadProfileSignedIn] to [NAV_STUDENT]			  
go
																	  
grant execute on dbo.[ReadProfileSignedInByAuth] to [NAV_STUDENT]		  
go
grant execute on dbo.[ReadProfileSignedInByAuth] to [NAV_ADMIN]		  
go
grant execute on dbo.[ReadProfileSignedInByAuth] to [NAV_ESP]		  
go
																	  
grant execute on dbo.[CreateProfile] to [NAV_ADMIN]					  
go
grant execute on dbo.[CreateProfile] to [NAV_ESP]					  
go
grant execute on dbo.[CreateProfile] to [NAV_STUDENT]				  
go

grant execute on dbo.[UpdateProfile] to [NAV_ADMIN]					  
go
grant execute on dbo.[UpdateProfile] to [NAV_ESP]					  
go
grant execute on dbo.[UpdateProfile] to [NAV_STUDENT]				  
go


EXECUTE as USER = 'NAV_ADMIN';
go
--EXEC dbo.SignIn @account = 'qthiendev', @password = 'qthiendev';
--EXEC ReadProfile 5;
--select * from users
exec ReadProfileSignedInByAuth 2, 2
go
REVERT;
go
--declare @IsBanned BIT;
--set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
--if @IsBanned = 1 return;