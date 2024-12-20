﻿use NavCareerDB;

if object_id('ReadProfile', 'P') is not null drop procedure ReadProfile;
go
create procedure ReadProfile @user_id INT
as
begin
	if not exists (select 1 from Users where [user_id] = @user_id) 
	begin
		select 'U_UID' as [check];
		return;
	end

	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0))
	begin
		select 'INACTIVE' as [check];
		return;
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
		return;
	end

	if not exists (select 1 from Users where [user_id] = @user_id)
	begin
		select 'U_UID' as [check];
		return;
	end

	if (exists (select 1 from Users where [user_id] = @user_id AND [user_status] = 0)) and @aid != @user_id 
	begin
		select 'INACTIVE' as [check];
		return;
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


    insert into Users ([user_full_name],
		[user_birthdate],
		[user_alias],
		[user_gender],
		[user_email], 
		[user_phone_number],
		[user_address], 
		[user_created_date],
		[user_status],
		[authentication_id]
	)
	values(@user_full_name, convert(datetime, @user_birthdate, 120), STR(@aid),  @user_gender, @user_email,  @user_phone_number, @user_address, GETDATE(), 1, @aid);

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
grant execute on dbo.[ReadProfile] to [NAV_GUEST]                     
go
grant execute on dbo.[ReadProfile] to [NAV_ADMIN]					  
go
grant execute on dbo.[ReadProfile] to [NAV_ESP]						  
go
grant execute on dbo.[ReadProfile] to [NAV_STUDENT]					  
go
																	  
grant execute on dbo.[ReadProfileSignedIn] to [NAV_ADMIN]			  
go
grant execute on dbo.[ReadProfileSignedIn] to [NAV_ESP]				  
go
grant execute on dbo.[ReadProfileSignedIn] to [NAV_STUDENT]			  
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
go
REVERT;
go
--declare @IsBanned BIT;
--set @IsBanned = dbo.IsUserBanned(@aid, 'CreateAuthorization');
--if @IsBanned = 1 return;