use NavCareerDB
go

if object_id('ReadAllUser', 'P') is not null drop procedure ReadAllUser;
go
create procedure ReadAllUser
as
begin

	select a.[authentication_id],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[account])) as [account],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[password])) as [password],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[identifier_email])) as [identifier_email],
		a.[auth_status],
		az.[role],
		u.[user_id],
		u.[user_full_name],
		u.[user_alias],
		u.[user_bio],
		u.[user_birthdate],
		u.[user_gender],
		u.[user_email],
		u.[user_phone_number],
		u.[user_address],
		u.[user_status]
	from Authentications a
		left join Users u on u.authentication_id = a.authentication_id
		left join Authorizations az on az.authorization_id = a.authorization_id
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadUser', 'P') is not null drop procedure ReadUser;
go
create procedure ReadUser @aid int
as
begin
	select a.[authentication_id],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[account])) as [account],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[password])) as [password],
		convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[identifier_email])) as [identifier_email],
		a.[auth_status],
		az.[role],
		u.[user_id],
		u.[user_full_name],
		u.[user_alias],
		u.[user_bio],
		u.[user_birthdate],
		u.[user_gender],
		u.[user_email],
		u.[user_phone_number],
		u.[user_address],
		u.[user_status]
	from Authentications a
		left join Users u on u.authentication_id = a.authentication_id
		left join Authorizations az on az.authorization_id = a.authorization_id
	where a.[authentication_id] = @aid
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ModifyUser', 'P') is not null drop procedure ModifyUser;
go
create procedure ModifyUser
    @authentication_id int,
    @account NVARCHAR(MAX),
    @password NVARCHAR(MAX),
    @identifier_email NVARCHAR(MAX), 
    @authorization_id int,
    @auth_status bit,

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
    set nocount on; -- Avoids extra messages
    declare @result NVARCHAR(10);

    -- Start transaction
    begin try
        begin transaction;

        declare @encoded_account varbinary(max);
        declare @encoded_password varbinary(max);
        declare @encoded_identifier_email varbinary(max);

        set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
        set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
        set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);

        -- Update Authentications
        update Authentications
        set [account] = @encoded_account,
            [password] = @encoded_password,
            [identifier_email] = @encoded_identifier_email,
            [authorization_id] = @authorization_id,
            [auth_status] = @auth_status
        where [authentication_id] = @authentication_id;

        if @@ROWCOUNT = 0
        begin
            rollback transaction;
            set @result = 'FALSE';
            select @result as [check];
            return;
        end

        if not exists (
            select 1 
            from Users 
            where [authentication_id] = @authentication_id
        ) 
		begin
			declare @user_id int;

			select top 1 @user_id = u1.[user_id] + 1
			from Users u1
				left join Users u2 on u1.[user_id] + 1 = u2.[user_id]
			where u2.[user_id] is null
			order by u1.[user_id];

			if @user_id is null select @user_id = isnull(max([user_id]), 0) + 1 from Users;

			insert into Users ([user_id], [user_full_name], [user_alias], [user_email], [user_birthdate], [user_gender], [user_phone_number], [user_address], [user_created_date], [authentication_id])
			values
			(@user_id, @user_full_name, @user_alias, @user_email, @user_birthdate, @user_gender, @user_phone_number, @user_address, getdate(), @authentication_id);

			if @@ROWCOUNT = 0
			begin
			    rollback transaction;
			    set @result = 'FALSE';
			    select @result as [check];
			    return;
			end
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
		where [authentication_id] = @authentication_id

		if @@ROWCOUNT = 0
		begin
			rollback transaction;
			set @result = 'FALSE';
			select @result as [check];
			return;
		end

        commit transaction;
        set @result = 'TRUE';
    end try
    begin catch
        rollback transaction;
        set @result = 'FALSE';
    end catch

    -- Return the result
    select @result as [check];
end;
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
--select * from Authentications where [authentication_id] = 2;
--select * from Users where [authentication_id] = 2;
--exec ModifyUser 2, 'nav_student', 'nav_student', 'navstdffff@gmail.com', 3, 1, 'Student', 'std0', 'heh222222e', '2003-12-16', 1, 'navstd@gmail.com', '0395075100', 'Da Nang', 1
--select * from Authentications where [authentication_id] = 2;
--select * from Users where [authentication_id] = 2;
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadAllProcedureBanned', 'P') is not null drop procedure ReadAllProcedureBanned;
go
create procedure ReadAllProcedureBanned
as
begin
    select auth.[authentication_id],
        convert(nvarchar(max), decryptbypassphrase('NavCareerSecret', auth.[account])) as [account],
        [procedure_name]
    from Authentications auth
    left join  AuthProcedureBanned apb on auth.[authentication_id] = apb.[authentication_id];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('ReadAllProcedureBannedESP', 'P') is not null drop procedure ReadAllProcedureBannedESP;
go
create procedure ReadAllProcedureBannedESP
as
begin
    select auth.[authentication_id],
        convert(nvarchar(max), decryptbypassphrase('NavCareerSecret', auth.[account])) as [account],
        [procedure_name]
    from Authentications auth
    left join  AuthProcedureBanned apb on auth.[authentication_id] = apb.[authentication_id]
	where auth.[authorization_id] = 2;
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CreateBanned', 'P') is not null drop procedure CreateBanned;
go
create procedure CreateBanned @authentication_id int, @procedure_name nvarchar(1024)
as
begin
    if object_id(@procedure_name, 'P') is null
    begin
        select 'U_P_NAME' as [check], 'The specified procedure does not exist.' as [message];
        return;
    end

    if not exists (select 1 from Authentications where authentication_id = @authentication_id)
    begin
        select 'U_AID' as [check], 'The specified authentication ID does not exist.' as [message];
        return;
    end

    declare @id int;

    select top 1 @id = apb1.[id] + 1
    from AuthProcedureBanned apb1
        left join AuthProcedureBanned apb2 on apb1.[id] + 1 = apb2.[id]
    where apb2.[id] is null
    order by apb1.[id];

    if @id is null 
        select @id = isnull(max([id]), 0) + 1 from AuthProcedureBanned;

    insert into AuthProcedureBanned ([id], [authentication_id], [procedure_name])
    values
    (@id, @authentication_id, @procedure_name);

    if @@ROWCOUNT = 1
    begin
        select 'SUCCESSED' as [check], 'The procedure has been successfully banned.' as [message];
        return;
    end

    select 'FAILED' as [check], 'Failed to insert the procedure into AuthProcedureBanned.' as [message];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('RemoveBanned', 'P') is not null drop procedure RemoveBanned;
go
create procedure RemoveBanned @authentication_id int, @procedure_name nvarchar(1024)
as
begin
    if object_id(@procedure_name, 'P') is null
    begin
        select 'U_P_NAME' as [check], 'The specified procedure does not exist.' as [message];
        return;
    end

    if not exists (select 1 from Authentications where authentication_id = @authentication_id)
    begin
        select 'U_AID' as [check], 'The specified authentication ID does not exist.' as [message];
        return;
    end

    -- check if the banned procedure entry exists
    if not exists (select 1 from AuthProcedureBanned where [authentication_id] = @authentication_id and [procedure_name] = @procedure_name)
    begin
        select 'E_BAN' as [check], 'Ban existed.' as [message];
        return;
    end

    delete from AuthProcedureBanned
    where authentication_id = @authentication_id
      and procedure_name = @procedure_name;

    if @@rowcount = 1
    begin
        select 'SUCCESSED' as [check], 'The ban entry has been successfully removed.' as [message];
        return;
    end

    select 'FAILED' as [check], 'Failed to remove the ban entry from AuthProcedureBanned.' as [message];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
if object_id('CheckBanned', 'P') is not null drop procedure CheckBanned;
go
create procedure CheckBanned @aid int, @procedure_name nvarchar(1024)
as
begin
	if exists (
		select 1 
		from AuthProcedureBanned
		where [authentication_id] = @aid
			and [procedure_name] = @procedure_name
	) begin select 'BANNED'as [check] end;

	select 'UNBANNED'as [check];
end
go
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
grant execute on dbo.CreateAuthentication to [NAV_ADMIN];
go
grant execute on dbo.ReadAllUser to [NAV_ADMIN];
go
grant execute on dbo.ReadUser to [NAV_ADMIN];
go
grant execute on dbo.ModifyUser to [NAV_ADMIN];
go
grant execute on dbo.ReadAllProcedureBanned to [NAV_ADMIN];
go
grant execute on dbo.ReadAllProcedureBannedESP to [NAV_ADMIN];
go
grant execute on dbo.CreateBanned to [NAV_ADMIN];
go
grant execute on dbo.RemoveBanned to [NAV_ADMIN];
go
grant execute on dbo.CheckBanned to [NAV_ADMIN];
go
grant execute on dbo.CheckBanned to [NAV_ESP];
go
grant execute on dbo.CheckBanned to [NAV_STUDENT];
go

