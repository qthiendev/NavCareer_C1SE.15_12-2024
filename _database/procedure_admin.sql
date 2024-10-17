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
		a.[is_active] as [auth_status],
		az.[role],
		u.[user_id],
		u.[user_full_name],
		u.[birthdate],
		u.[gender],
		u.[email],
		u.[phone_number],
		u.[address],
		u.[is_active] as [user_status]
	from Authentications a
		left join Users u on u.authentication_id = a.authentication_id
		left join Authorizations az on az.authorization_id = a.authorization_id
end
go

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
    @birthdate DATETIME, 
    @gender BIT, 
    @email NVARCHAR(MAX), 
    @phone_number NVARCHAR(30), 
    @address NVARCHAR(MAX),
    @user_status bit
as
begin
    -- Start transaction
    begin transaction;

    declare @encoded_account varbinary(max);
    declare @encoded_password varbinary(max);
    declare @encoded_identifier_email varbinary(max);

    set @encoded_account = EncryptByPassPhrase('NavCareerSecret', @account);
    set @encoded_password = EncryptByPassPhrase('NavCareerSecret', @password);
    set @encoded_identifier_email = EncryptByPassPhrase('NavCareerSecret', @identifier_email);

    update Authentications
    set [account] = @encoded_account,
        [password] = @encoded_password,
        [identifier_email] = @encoded_identifier_email,
        [authorization_id] = @authorization_id,
        [is_active] = @auth_status
    where [authentication_id] = @authentication_id;

    update Users
    set [user_full_name] = @user_full_name,
        [birthdate] = @birthdate, 
        [gender] = @gender, 
        [email] = @email, 
        [phone_number] = @phone_number, 
        [address] = @address,
        [is_active] = @user_status
    where [authentication_id] = @authentication_id;

    -- Variable to hold the result
    declare @result NVARCHAR(10);

    -- Check if the updates are valid
    if exists (
        select 1
        from Authentications a
            join Users u on u.authentication_id = a.authentication_id
        where a.[authentication_id] = @authentication_id
            and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[account])) = @account
            and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[password])) = @password
            and convert(nvarchar(max), DecryptByPassPhrase('NavCareerSecret', a.[identifier_email])) = @identifier_email
            and a.[authorization_id] = @authorization_id
            and a.[is_active] = @auth_status
            and u.[user_full_name] = @user_full_name
            and u.[birthdate] = @birthdate
            and u.[gender] = @gender
            and u.[email] = @email 
            and u.[phone_number] = @phone_number 
            and u.[address] = @address
            and u.[is_active] = @user_status
    )
    begin
        -- If the check is successful, commit the transaction
        commit transaction;
        set @result = 'TRUE';
    end
    else
    begin
        -- If the check fails, rollback the transaction
        rollback transaction;
        set @result = 'FALSE';
    end

    -- Return the result
    select @result as [check];
end
go


grant execute on dbo.ReadAllUser to [NAV_ADMIN];
grant execute on dbo.ModifyUser to [NAV_ADMIN];
go

